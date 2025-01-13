import { User } from "../models/User.model";
import ApiError from "./ApiError";

export const verifyUserChangePassword = (currentUser: User, decoded, t) => {
  // 4) Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = currentUser.passwordChangedAt.getTime() / 1000;
    // Password changed after token created (Error)
    if (decoded.iat && passChangedTimestamp > decoded.iat) {
      throw new ApiError(t("passwordChanged"), 401);
    }
  }
};
