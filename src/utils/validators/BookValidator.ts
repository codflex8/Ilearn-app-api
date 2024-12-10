import { z } from "zod";

export const addBookValidator = z.object({
  name: z.string(),
  categoryId: z.string().optional(),
  localPath: z.string().optional().nullable(),
  // imageUrl: z.string().optional().nullable(),
  fileUrl: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
});

export const setLocalPathValidation = z.object({
  localPath: z.string(),
});
