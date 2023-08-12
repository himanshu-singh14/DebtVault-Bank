import User from "../models/User";
import UserDao from "../dao/UserDAO";

const userDao = new UserDao();

class UserService {
  // Registers a new user with the provided information
  async registerUser(name: string, mobileNumber: string, password: string): Promise<User | null> {
    if (name && mobileNumber && password) {
      const existingUser = await this.getUserByMobileNumber(mobileNumber);
      if (existingUser) {
        throw {
          statusCode: 409,
          errorMessage: "User already exists with the provided mobile number.",
        };
      }
      return await userDao.createUser(name, mobileNumber, password);
    } else {
      throw {
        statusCode: 400,
        errorMessage: "Required fields (name, mobileNumber, password) are missing.",
      };
    }
  }

  // Retrieves a user by their mobile number
  async getUserByMobileNumber(mobileNumber: string): Promise<User | null> {
    const user = await userDao.getUserByMobileNumber(mobileNumber);
    return user;
  }
}

export default UserService;
