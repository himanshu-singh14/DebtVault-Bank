import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const { BCRYPT_SALT_ROUNDS } = process.env;
const saltRounds = parseInt(BCRYPT_SALT_ROUNDS || "10", 10);

// Hash a password
const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword
}

// Compare a password
const comparePassword = async (hashedPassword: string, password: string): Promise<boolean> => {
  const result = await bcrypt.compare(password, hashedPassword);
  return result
}

export default {hashPassword, comparePassword}
