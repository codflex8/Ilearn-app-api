import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { User } from "../../models/User.model";
import { Equal, Not } from "typeorm";
import ApiError from "../../utils/ApiError";
import { IProfile } from "../../utils/validators/profileValidator";

type IProfileWithImage = IProfile & {
  image: string;
};

export const updateProfileData = asyncHandler(
  async (
    req: Request<{}, {}, IProfileWithImage>,
    res: Response,
    next: NextFunction
  ) => {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
    });
    const {
      phoneNumber,
      email,
      username,
      birthDate,
      gender,
      image,
      booksGoal,
      examsGoal,
      intensePoints,
      language,
    } = req.body;
    const isEmailExist = await User.findOne({
      where: {
        email: Equal(email),
        id: Not(Equal(user.id)),
      },
    });
    if (isEmailExist) {
      return next(new ApiError(req.t("email_is_used_by_other_user"), 409));
    }
    const isPhoneNumberExist = await User.findOne({
      where: {
        phoneNumber: Equal(phoneNumber),
        id: Not(Equal(user.id)),
      },
    });
    if (isPhoneNumberExist) {
      return next(
        new ApiError(req.t("phone_number_is_used_by_other_user"), 409)
      );
    }

    user.email = email;
    user.username = username;
    user.phoneNumber = phoneNumber ?? null;
    user.birthDate = birthDate ? new Date(birthDate) : null;
    user.gender = gender ?? null;
    if (image) user.imageUrl = image;
    user.booksGoal = booksGoal;
    user.examsGoal = examsGoal;
    user.intensePoints = intensePoints;
    if (language) user.language = language;
    await user.save();
    res.status(200).json({ user });
  }
);
