import User from "../models/User";

class UserDao {
  // Insert user to database
  async createUser(name: string, mobileNumber: string, password: string): Promise<User> {
    try {
      return await User.create({ name: name, mobileNumber: mobileNumber, password: password });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  // Retrieves a user by their mobile number
  async getUserByMobileNumber(mobileNumber: string): Promise<User | null> {
    return await User.findOne({
      where: { mobileNumber: mobileNumber },
    });
  }

  // Update user's details
  async updateUser(userData: any) {
    const { mobileNumber, ...userDataWithoutMobileNumber } = userData;
    return await User.update(userDataWithoutMobileNumber, {
      where: { mobileNumber: userData.mobileNumber },
    });
  }
}

export default UserDao;
