import { z } from "zod";
import { GenderEnum } from "./AuthValidator";

export const updateProfileValidator = z.object({
  username: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().optional().nullable(),
  birthDate: z.string().optional().nullable(),
  gender: z.nativeEnum(GenderEnum).optional().nullable(),
  booksGoal: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().optional().nullable().default(10)
  ),
  examsGoal: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().optional().nullable().default(10)
  ),
  intensePoints: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().optional().nullable().default(10)
  ),
});
export type IProfile = z.infer<typeof updateProfileValidator>;
