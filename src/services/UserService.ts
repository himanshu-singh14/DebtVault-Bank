import User from "../models/User";
import UserDao from "../dao/UserDAO";
import { NotFoundError, BadRequestError, WrongPasswordError, AlreadyExistError } from "../exceptions/Exceptions";

const userDao = new UserDao();

class UserService {
  // Registers a new user with the provided information
  async registerUser(name: string, mobileNumber: string, password: string): Promise<User | null> {
    if (!(name && mobileNumber && password)) {
      throw new BadRequestError("Invalid Credential");
    }
    const existingUser = await this.getUserByMobileNumber(mobileNumber);
    if (existingUser) {
      throw new AlreadyExistError("User already exists with the provided mobile number.");
    }
    return await userDao.createUser(name, mobileNumber, password);
  }

  // Retrieves a user by their mobile number
  async getUserByMobileNumber(mobileNumber: string): Promise<User | null> {
    return await userDao.getUserByMobileNumber(mobileNumber);
  }

  // User Login
  async loginUser(mobileNumber : string, password: string) {
    if (!(mobileNumber && password)) {
      throw new BadRequestError("Invalid Credential");
    }
    const user = await this.getUserByMobileNumber(mobileNumber);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    if (user.dataValues.isLoggedIn) {
      throw new AlreadyExistError("User is already logged in.");
    }
    if (!(password === user.dataValues.password)) {
      throw new WrongPasswordError("Password is wrong.");
    }
    const userData = {
      mobileNumber: user.dataValues.mobileNumber,
      isLoggedIn: true,
    };
    await userDao.updateUser(userData);
    return user?.dataValues.name;
  }
}

export default UserService;
