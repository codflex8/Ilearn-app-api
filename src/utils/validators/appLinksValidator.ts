import { z } from "zod";

export const appLinksValidator = z.object({
  androidLink: z.string(),
  appleLink: z.string(),
});
