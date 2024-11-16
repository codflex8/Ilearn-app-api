import jwt from "jsonwebtoken";

export const createToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

export const createRefreshToken = (userId) => {
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_Refresh_SECRET_KEY as string,
    {
      expiresIn: process.env.JWT_Refresh_EXPIRE_TIME,
    }
  );

  return refreshToken;
};
