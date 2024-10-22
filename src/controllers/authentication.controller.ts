import { NextFunction, Request, Response } from "express";
import { User } from "../models/User.model";
import ApiError from "../utils/ApiError";
import * as bcrypt from "bcryptjs";
import createToken from "../utils/createToken";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail";
import bcryptPassword from "../utils/bcryptPassword";
import generateRandomCode from "../utils/generateCode";
import { Equal } from "typeorm";

interface JwtPayload extends jwt.JwtPayload {
  userId: string;
}

export const signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1- Create user
    const cryptedPassword = await bcryptPassword(req.body.password);
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: cryptedPassword,
      imageUrl: req.body.imageUrl,
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

    delete user.password;

    res.status(200).json({ user, token });
  }
);

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as JwtPayload;

    // 3) Check if user exists
    const currentUser = await User.findOne({ where: { id: decoded.userId } });
    if (!currentUser) {
      return next(
        new ApiError(
          "The user that belong to this token does no longer exist",
          401
        )
      );
    }

    // 4) Check if user change his password after token created
    if (currentUser.passwordChangedAt) {
      const passChangedTimestamp =
        currentUser.passwordChangedAt.getTime() / 1000;
      // Password changed after token created (Error)
      if (passChangedTimestamp > decoded.at) {
        return next(
          new ApiError(
            "User recently changed his password. please login again..",
            401
          )
        );
      }
    }
    // ToDo: set user
    // req.user = currentUser;
    next();
  }
);

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
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate token
  const token = createToken(user.id);
  res.status(200).json({ token });
});
