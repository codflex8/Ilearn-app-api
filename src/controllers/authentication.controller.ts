import { NextFunction, Request, Response } from "express";
import { User } from "../models/User.model";
import ApiError from "../utils/ApiError";
import * as bcrypt from "bcryptjs";
import { createRefreshToken, createToken } from "../utils/createToken";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail";
import bcryptPassword from "../utils/bcryptPassword";
import generateRandomCode from "../utils/generateCode";
import { Equal, Or } from "typeorm";
import { getUserFromToken } from "../utils/getUserFromToken";
import {
  getFacebookUserData,
  getTwitterUserData,
  verifyGoogleAuth,
} from "../utils/socialMediaAuth";

interface JwtPayload extends jwt.JwtPayload {
  userId: string;
}

export const signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password, image } = req.body;
    const isUserExist = await User.findOne({
      where: {
        email: Equal(req.body.email),
      },
    });
    if (isUserExist) {
      return next(new ApiError("email is used by other user", 409));
    }
    // 1- Create user
    const cryptedPassword = await bcryptPassword(password);
    const user = await User.create({
      username,
      email,
      password: cryptedPassword,
      imageUrl: image,
    });

    await user.save();
    delete user.password;
    delete user.passwordChangedAt;
    delete user.passwordResetCode;
    delete user.passwordResetExpires;
    delete user.passwordResetVerified;
    // 2- Generate token
    const token = createToken(user.id);

    res.status(201).json({ data: user, token });
  }
);

export const signIn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOneBy({ email: Equal(req.body.email) });

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return next(new ApiError("Incorrect email or password", 401));
    }
    const token = createToken(user.id);
    const refreshToken = createRefreshToken(user.id);
    delete user.password;

    res.status(200).json({ user, token, refreshToken });
  }
);

export const refreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.body.refreshToken;

  // if (!refreshToken || !refreshTokens.includes(refreshToken)) {
  //   return res.status(403).json({ message: 'Refresh token not found' });
  // }

  jwt.verify(
    refreshToken,
    process.env.JWT_Refresh_SECRET_KEY!,
    async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }
      const currentUser = await User.findOne({
        where: {
          id: decoded?.userId,
        },
      });
      if (!currentUser)
        return res.status(401).json({ message: "Invalid refresh token" });

      try {
        verifyUserChangePassword(currentUser, decoded);
      } catch (error: any) {
        return next(error);
      }
      const newAccessToken = createToken((decoded as any).userId);
      res.json({ token: newAccessToken });
    }
  );
};

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(
        new ApiError(
          "You are not login, Please login to get access this route",
          401
        )
      );
    }

    // 2) Verify token (no change happens, expired token)
    const { currentUser, decoded } = await getUserFromToken(token);
    if (!currentUser) {
      return next(
        new ApiError(
          "The user that belong to this token does no longer exist",
          401
        )
      );
    }
    try {
      verifyUserChangePassword(currentUser, decoded);
    } catch (error: any) {
      return next(error);
    }
    delete currentUser.password;
    delete currentUser.passwordChangedAt;
    delete currentUser.passwordResetCode;
    delete currentUser.passwordResetExpires;
    delete currentUser.passwordResetVerified;

    req.user = currentUser;
    next();
  }
);

const verifyUserChangePassword = (currentUser: User, decoded) => {
  // 4) Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = currentUser.passwordChangedAt.getTime() / 1000;
    // Password changed after token created (Error)
    if (decoded.iat && passChangedTimestamp > decoded.iat) {
      throw new ApiError(
        "User recently changed his password. please login again..",
        401
      );
    }
  }
};

export const forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ where: { email: Equal(req.body.email) } });
  if (!user) {
    return next(
      new ApiError(`There is no user with that email ${req.body.email}`, 404)
    );
  }
  // 2) If user exist, Generate hash reset random 6 digits and save it in db
  const resetCode = generateRandomCode();

  // Save hashed password reset code into db
  user.passwordResetCode = resetCode;
  // Add expiration time for password reset code (1 min)
  const oneMinuteLater = new Date(Date.now() + 1 * 60 * 1000);
  user.passwordResetExpires = oneMinuteLater;
  user.passwordResetVerified = false;

  await user.save();

  // 3) Send the reset code via email
  const message = `Hi ${user.username},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});

export const verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    return next(new ApiError("Reset code invalid or expired", 400));
  }
  const timeDiff = Date.now() - Number(user.passwordResetExpires);

  const oneMinutesInMilliesecond = 60000;
  if (
    timeDiff > oneMinutesInMilliesecond ||
    user.passwordResetCode != req.body.resetCode
  ) {
    return next(new ApiError("Reset code invalid or expired", 400));
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "Success",
  });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ where: { email: Equal(req.body.email) } });
  if (!user) {
    return next(
      new ApiError(`There is no user with email ${req.body.email}`, 404)
    );
  }

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }
  const cryptedPassword = await bcryptPassword(req.body.password);
  user.password = cryptedPassword;
  user.passwordChangedAt = new Date();
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = false;

  await user.save();

  // 3) if everything is ok, generate token
  const token = createToken(user.id);
  res.status(200).json({ token });
});

const createSocialMediaUser = async ({
  email,
  username,
  imageUrl,
  googleId,
  facebookId,
  twitterId,
}: {
  email: string;
  username: string;
  imageUrl: string;
  googleId?: string;
  facebookId?: string;
  twitterId?: string;
}) => {
  const newUser = User.create({
    email,
    username,
    imageUrl,
    googleId,
    facebookId,
    twitterId,
  });
  await newUser.save();
  return newUser;
};

export const googleAuthSignUp = asyncHandler(async (req, res, next) => {
  const { token } = req.body;
  const { email, username, imageUrl, userId } = await verifyGoogleAuth(token);
  const isUserExist = await User.findOne({
    where: [
      {
        googleId: userId,
      },
      {
        email,
      },
    ],
  });
  if (isUserExist) {
    return next(new ApiError("user already signed up", 409));
  }
  const newUser = await createSocialMediaUser({
    email,
    username,
    imageUrl,
    googleId: userId,
  });
  const authToken = createToken(newUser.id);
  res.status(201).json({
    message: "google signup success",
    user: newUser,
    token: authToken,
  });
});

export const googleAuthSignIn = asyncHandler(async (req, res, next) => {
  const { token } = req.body;
  const userData = await verifyGoogleAuth(token);

  const user = await User.getPublicUserDataByEmail({ email: userData.email });
  if (!user) {
    return next(new ApiError("user email not exist", 409));
  }

  const authToken = createToken(user.id);
  res.status(201).json({ user, token: authToken });
});

export const facebookAuthSignUp = asyncHandler(async (req, res, next) => {
  const { token } = req.body;
  const { email, username, imageUrl, userId } = await getFacebookUserData(
    token
  );
  const isUserExist = await User.findOne({
    where: [
      {
        facebookId: userId,
      },
      {
        email,
      },
    ],
  });
  if (isUserExist) {
    return next(new ApiError("user already signed up", 409));
  }
  const newUser = await createSocialMediaUser({
    email,
    username,
    imageUrl,
    facebookId: userId,
  });
  const authToken = createToken(newUser.id);
  res.status(201).json({
    message: "facebook signup success",
    user: newUser,
    token: authToken,
  });
});

export const facebookAuthSignIn = asyncHandler(async (req, res, next) => {
  const { token } = req.body;
  const { userId } = await getFacebookUserData(token);

  const user = await User.getPublicUserDataByEmail({ facebookId: userId });
  if (!user) {
    return next(new ApiError("user  not signed up", 409));
  }

  const authToken = createToken(user.id);
  res.status(201).json({ user, token: authToken });
});

export const twitterAuthSignUp = asyncHandler(async (req, res, next) => {
  const { token } = req.body;
  const { email, username, imageUrl, userId } = await getTwitterUserData(token);
  const isUserExist = await User.findOne({
    where: [
      {
        twitterId: userId,
      },
      {
        email,
      },
    ],
  });
  if (isUserExist) {
    return next(new ApiError("user already signed up", 409));
  }
  const newUser = await createSocialMediaUser({
    email,
    username,
    imageUrl,
    twitterId: userId,
  });
  const authToken = createToken(newUser.id);
  res.status(201).json({
    message: "twitter signup success",
    user: newUser,
    token: authToken,
  });
});

export const twitterAuthSignIn = asyncHandler(async (req, res, next) => {
  const { token } = req.body;
  const userData = await getTwitterUserData(token);

  const user = await User.getPublicUserDataByEmail({ email: userData.email });
  if (!user) {
    return next(new ApiError("user email not exist", 409));
  }

  const authToken = createToken(user.id);
  res.status(201).json({ user, token: authToken });
});
