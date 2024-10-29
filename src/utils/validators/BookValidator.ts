import { z } from "zod";

export const addBookValidator = z.object({
  name: z.string(),
  categoryId: z.string(),
  imageUrl: z.string().optional().nullable(),
  fileUrl: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
});
