import { z } from "zod";

export enum GenderEnum {
  MALE = "male",
  FEMALE = "female",
}

export const signInValidator = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fcm: z.string().optional(),
});

export const signUpValidator = signInValidator.extend({
  username: z.string(),
  imageUrl: z.string().optional().nullable(),
});

export const forgetPasswordValidator = z.object({
  email: z.string().email(),
});

export const verifyForgetPasswordValidator = z.object({
  email: z.string().email(),
  resetCode: z.string().length(4),
});

export const resetPasswordValidator = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const socialMediaAuthValidator = z.object({
  token: z.string(),
});

export const addFcmValidation = z.object({
  fcm: z.string(),
});
