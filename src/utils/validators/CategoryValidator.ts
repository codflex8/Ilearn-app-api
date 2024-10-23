import { z } from "zod";

export const addCategoryValidator = z.object({
  name: z.string().min(1),
  imageUrl: z.string().optional().nullable(),
});
