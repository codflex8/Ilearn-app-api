import { z } from "zod";

export const addTermAndPolicyValidator = z.object({
  policy: z.string(),
  terms: z.string(),
});
