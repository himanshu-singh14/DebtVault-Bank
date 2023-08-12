import User from "../models/User";
import UserAttributes from "../models/User";

class UserDao {
  // Retrieves a user by their mobile number
  async getUserByMobileNumber(mobileNumber: string): Promise<User | null> {
    return await User.findOne({
      where: { mobileNumber: mobileNumber },
    });
  }

  // Insert user to database
  async createUser(name: string, mobileNumber: string, password: string): Promise<User> {
    try {
      return await User.create({name: name, mobileNumber: mobileNumber, password: password});
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export default UserDao;
