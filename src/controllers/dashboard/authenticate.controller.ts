import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { User } from "../../models/User.model";
import { UsersRoles } from "../../utils/validators/AuthValidator";
import * as bcrypt from "bcryptjs";
import ApiError from "../../utils/ApiError";
import { createToken } from "../../utils/createToken";
import bcryptPassword from "../../utils/bcryptPassword";
import { getUserFromToken } from "../../utils/getUserFromToken";

export const signin = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOneBy({
      email: req.body.email,
      role: UsersRoles.admin,
    });
    if (
      !user ||
      !(await bcrypt.compare(req.body.password, user.dashboardPassword))
    ) {
      return next(new ApiError(req.t("IncorrectEmailPasswod"), 400));
    }
    const token = await createToken(user.id);
    res.status(200).json({ token, user });
  }
);

export const defaultAdmin = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const isAdminExist = await User.findOneBy({
      role: UsersRoles.admin,
    });
    if (isAdminExist) {
      throw new ApiError("admin exist", 400);
    }
    const cryptedPassword = await bcryptPassword("admin.***");
    const addAdmin = User.create({
      email: "admin@admin.com",
      dashboardPassword: cryptedPassword,
      username: "admin",
      role: UsersRoles.admin,
    });
    await addAdmin.save();
    res.status(200).json({ message: "success" });
  }
);

export const addAdmin = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, username } = req.body;
    const isUserExist = await User.findOne({ where: { email } });
    if (isUserExist && isUserExist.role === UsersRoles.admin) {
      throw new ApiError(req.t("this_email_signed_up_already"), 409);
    }
    const cryptedPassword = await bcryptPassword(password);
    if (isUserExist) {
      isUserExist.role = UsersRoles.admin;
      isUserExist.dashboardPassword = cryptedPassword;
      await isUserExist.save();
      res.status(200).json({ message: req.t("sign_up_success") });
      return;
    }
    const newUser = await User.create({
      email,
      dashboardPassword: cryptedPassword,
      username,
    });
    await newUser.save();
    res.status(200).json({ message: req.t("sign_up_success") });
  }
);

export const protectAdmin = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    console.log("tokennnn", token);
    if (!token) {
      return next(new ApiError(req.t("unauthorized"), 401));
    }
    // 2) Verify token (no change happens, expired token)
    const { currentUser, decoded } = await getUserFromToken(token);
    console.log("ddddddd", currentUser);

    if (!currentUser || currentUser.role !== UsersRoles.admin) {
      return next(new ApiError(req.t("unauthorized"), 401));
    }

    req.user = currentUser;
    next();
  }
);
