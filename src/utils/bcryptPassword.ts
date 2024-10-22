import bcrypt from "bcryptjs";
const bcryptPassword = async (password: string) => {
  return await bcrypt.hash(password, 12);
};
export default bcryptPassword;
