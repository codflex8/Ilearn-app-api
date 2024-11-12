import { z, ZodError, ZodType } from "zod";

const schemaValidator = (
  schema: z.ZodObject<any, any> | ZodType<any>,
  data
) => {
  try {
    schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors
        .map((issue: any) => `${issue.path.join(".")} is ${issue.message}`)
        .join(", ");
      throw new Error(errorMessages);
    }
  }
};

export default schemaValidator;
