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
    const existingUser = await userDao.getUserByMobileNumber(mobileNumber);
    if (existingUser) {
      throw new AlreadyExistError("User already exists with the provided mobile number.");
    }
    return await userDao.createUser(name, mobileNumber, password);
  }

  // Retrieves a user by their mobile number
  async getUserByMobileNumber(mobileNumber: string): Promise<User> {
    const user = await userDao.getUserByMobileNumber(mobileNumber);
    if (!user) {
      throw new NotFoundError("User not found with given mobile number");
    }
    return user;
  }

  // User Login
  async login(mobileNumber: string, password: string) {
    if (!(mobileNumber && password)) {
      throw new BadRequestError("Invalid Credential");
    }
    const user = await this.getUserByMobileNumber(mobileNumber);
    if (user.dataValues.isLoggedIn) {
      throw new AlreadyExistError("User is already logged in.");
    }
    if (!(password === user.dataValues.password)) {
      throw new WrongPasswordError("Password is wrong.");
    }
    const userData = {
      mobileNumber: mobileNumber,
      isLoggedIn: true,
    };
    await userDao.updateUser(userData);
    return user?.dataValues.name;
  }

  // User logout
  async logout(mobileNumber: string) {
    if (!mobileNumber) {
      throw new BadRequestError("Please enter mobile number.");
    }
    const user = await this.getUserByMobileNumber(mobileNumber);
    if (!user.dataValues.isLoggedIn) {
      throw new AlreadyExistError("User is already logged out.");
    }
    const userData = {
      mobileNumber: mobileNumber,
      isLoggedIn: false,
    };
    await userDao.updateUser(userData);
    return user?.dataValues.name;
  }

  // Change password
  async changePassword(mobileNumber: string, oldPassword: string, newPassword: string) {
    if (!(oldPassword && newPassword)) {
      throw new BadRequestError("Invalid Credential");
    }
    const user = await this.getUserByMobileNumber(mobileNumber);
    if (!(user.dataValues.password === oldPassword)) {
      throw new WrongPasswordError("Password didn't matched.");
    }
    const userData = {
      mobileNumber: mobileNumber,
      password: newPassword,
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
