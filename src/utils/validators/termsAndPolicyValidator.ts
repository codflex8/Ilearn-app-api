import { z } from "zod";

export const addTermValidator = z.object({
  terms: z.string(),
});

export const addPolicyValidator = z.object({
  policy: z.string(),
});
