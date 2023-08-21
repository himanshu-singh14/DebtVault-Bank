import JWT from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { JWT_SECRET_KEY } = process.env;

const createTokenForUser = (user: any) => {
  const payload = {
    name: user.dataValues.name,
    mobileNumber: user.dataValues.mobileNumber,
  };

  const expiresIn = "60m"; // Expiry time: 60 minutes
  const token = JWT.sign(payload, JWT_SECRET_KEY!, { expiresIn });
  return token;
};

const validateToken = (token: string): any => {
  JWT.verify(token, JWT_SECRET_KEY!);
};

export default { createTokenForUser, validateToken };