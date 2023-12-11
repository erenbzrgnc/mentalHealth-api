import crypto from "crypto";

const SECRET = "ENS492-MHAPP-V0";

export const random = () => crypto.randomBytes(18).toString("base64");
export const authentication = (salt: string, password: string) =>
  crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
export const generateConfirmationToken = () => {
      return crypto.randomBytes(20).toString('hex');
  };
  