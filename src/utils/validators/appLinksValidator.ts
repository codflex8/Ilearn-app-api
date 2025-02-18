import { z } from "zod";

export const appLinksValidator = z.object({
  androidLink: z.string(),
  appleLink: z.string(),
});

export const appVersionsValidator = z.object({
  androidVersion: z.string(),
  appleVersion: z.string(),
});
