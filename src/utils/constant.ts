import { randomBytes } from "crypto";

export const generateRefSlug = async (): Promise<string> => {
  const ref = randomBytes(12).toString("hex");

  return ref;
};
