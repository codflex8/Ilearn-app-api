import jwt from "jsonwebtoken";
const createToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

export default createToken;
