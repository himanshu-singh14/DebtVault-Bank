const User = require("../models/user.js");
const UserDao = require("../dao/user_dao.js");

const userDao = new UserDao();

class UserService {
  // Registers a new user with the provided information
  async registerUser(name, mobileNumber, password) {
    if (name && mobileNumber && password) {
      const existingUser = await this.getUserByMobileNumber(mobileNumber);
      if (existingUser) {
        throw {
          statusCode: 409,
          errorMessage: "User already exists with the provided mobile number.",
        };
      }
      // Create new user with given information
      const newUser = new User(name, mobileNumber, password);
      userDao.insert(newUser); // Insert user to database
      return await this.getUserByMobileNumber(mobileNumber);
    } else {
      throw {
        statusCode: 400,
        errorMessage:
          "Required fields (name, mobileNumber, password) are missing.",
      };
    }
  }

  // Retrieves a user by their mobile number
  async getUserByMobileNumber(mobileNumber) {
    const user = await userDao.getUserByMobileNumber(mobileNumber);
    return user;
  }
}

module.exports = UserService;