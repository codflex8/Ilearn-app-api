import { z } from "zod";

export const addBookValidator = z.object({
  name: z.string(),
  // categoryId: z.string().optional(),
  imageUrl: z.string().optional().nullable(),
  fileUrl: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  categoriesIds: z.array(z.string()).optional(),
});
