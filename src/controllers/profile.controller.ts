import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { User } from "../models/User.model";
import { Equal, Not } from "typeorm";
import ApiError from "../utils/ApiError";

export const updateProfileData = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { phoneNumber, email, username, birthDate, gender } = req.body;
    const isEmailExist = await User.findOne({
      where: {
        email: Equal(email),
        id: Not(Equal(user.id)),
      },
    });
    if (isEmailExist) {
      return next(new ApiError("email is used by other user", 409));
    }
    const isPhoneNumberExist = await User.findOne({
      where: {
        phoneNumber: Equal(phoneNumber),
        id: Not(Equal(user.id)),
      },
    });
    if (isPhoneNumberExist) {
      return next(new ApiError("phone number is used by other user", 409));
    }

    user.email = email;
    user.username = username;
    user.phoneNumber = phoneNumber;
    user.birthDate = birthDate;
    user.gender = gender;
    await user.save();
    res.status(200).json({ user });
  }
);
