import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/User.model";

export const getUserFromToken = async (token: string) => {
  const decoded = jwt.verify(
    token ?? "",
    process.env.JWT_SECRET_KEY as string
  ) as JwtPayload;

  // 3) Check if user exists
  const currentUser = await User.findOne({
    where: { id: decoded?.userId },
    select: [
      "id",
      "username",
      "email",
      "gender",
      "phoneNumber",
      "birthDate",
      "imageUrl",
    ],
  });

  return { currentUser, decoded };
};
