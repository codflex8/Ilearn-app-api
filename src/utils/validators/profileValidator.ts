import { z } from "zod";
import { GenderEnum } from "./AuthValidator";

export const updateProfileValidator = z.object({
  username: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().optional().nullable(),
  birthDate: z.string().optional().nullable(),
  gender: z.nativeEnum(GenderEnum).optional().nullable(),
});
