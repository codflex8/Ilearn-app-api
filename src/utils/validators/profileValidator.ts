import { z } from "zod";
import { GenderEnum } from "./AuthValidator";

export const updateProfileValidator = z.object({
  username: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  birthDate: z.string().date(),
  gender: z.nativeEnum(GenderEnum),
});
