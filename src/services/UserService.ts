import User from "../models/User";
import UserDao from "../dao/UserDAO";
import { NotFoundError, BadRequestError, WrongPasswordError, AlreadyExistError } from "../utils/Exceptions";
import PasswordHashing from "../utils/PasswordHashing";
import CreateToken from "../utils/Authentication";

const userDao = new UserDao();

class UserService {
  // Registers a new user with the provided information
  async registerUser(name: string, mobileNumber: string, password: string): Promise<User | null> {
    if (!(name && mobileNumber && password)) {
      throw new BadRequestError("Invalid Credential");
    }
    const existingUser = await userDao.getUserByMobileNumber(mobileNumber);
    if (existingUser) {
      throw new AlreadyExistError("User already exists with the provided mobile number.");
    }
    const hassedPassword = await PasswordHashing.hashPassword(password);
    return await userDao.createUser(name, mobileNumber, hassedPassword);
  }

  // Retrieves a user by their mobile number
  async getUserByMobileNumber(mobileNumber: string): Promise<User> {
    const user = await userDao.getUserByMobileNumber(mobileNumber);
    if (!user) {
      throw new NotFoundError("User not found.");
    }
    return user;
  }

  // User Login and generate token
  async login(mobileNumber: string, password: string) {
    if (!(mobileNumber && password)) {
      throw new BadRequestError("Invalid Credential");
    }
    const user = await this.getUserByMobileNumber(mobileNumber);
    const isMatched = await PasswordHashing.comparePassword(user.dataValues.password, password);
    if (!isMatched) {
      throw new WrongPasswordError("Password is wrong.");
    }
    const token: string = CreateToken.createTokenForUser(user);
    return token;
  }

  // User logout
  async logout(mobileNumber: string) {
    if (!mobileNumber) {
      throw new BadRequestError("Please enter mobile number.");
    }
    const user = await this.getUserByMobileNumber(mobileNumber);
    return user?.dataValues.name;
  }

  // Change password
  async changePassword(mobileNumber: string, oldPassword: string, newPassword: string) {
    if (!(oldPassword && newPassword)) {
      throw new BadRequestError("Invalid Credential");
    }
    const user = await this.getUserByMobileNumber(mobileNumber);
    const isMatched = await PasswordHashing.comparePassword(user.dataValues.password, oldPassword);
    if (!isMatched) {
      throw new WrongPasswordError("Password didn't matched.");
    }
    const hassedNewPassword = await PasswordHashing.hashPassword(newPassword);
    const userData = {
      mobileNumber: mobileNumber,
      password: hassedNewPassword,
    };
    await userDao.updateUser(userData);
    return user?.dataValues.name;
  }

  // Change Details
  async changeUserDetails(mobileNumber: string, details: any) {
    const user = await this.getUserByMobileNumber(mobileNumber);
    const filteredDetails: Record<string, any> = {};
    Object.entries(details).forEach(([key, value]) => {
      if (value !== null) {
        filteredDetails[key] = value;
      }
    });
    const mobile = { mobileNumber: mobileNumber };
    const combinedDetails = { ...mobile, ...filteredDetails };
    await userDao.updateUser(combinedDetails);
    return user?.dataValues.name;
  }

  // Show all users
  async showAllUsers(): Promise<object[]> {
    const users = await userDao.getAllUsers();
    if (users.length === 0) {
      throw new NotFoundError("Users not found");
    }
    return users;
  }

  // Delete user by mobile number
  async deleteUserByMobileNumber(mobileNumber: string): Promise<User> {
    const user = await this.getUserByMobileNumber(mobileNumber);
    await userDao.deleteUser(mobileNumber);
    return user;
  }
}

export default UserService;
