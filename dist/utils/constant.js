import { randomBytes } from "crypto";
export const generateRefSlug = async () => {
    const ref = randomBytes(12).toString("hex");
    return ref;
};
