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

  // Update user's details (like change password and set login/logout and other user details)
  async updateUser(userData: any) {
    const { mobileNumber, ...userDataWithoutMobileNumber } = userData;
    return await User.update(userDataWithoutMobileNumber, {
      where: { mobileNumber: userData.mobileNumber },
    });
  }

  // Retrieves all users
  async getAllUsers(): Promise<object[]> {
    const users = await User.findAll();
    return users.map((user) => user.dataValues);
  }

  // Delete a user by mobile number
  async deleteUser(mobileNumber: string): Promise<number> {
    return await User.destroy({
      where: { mobileNumber: mobileNumber },
    });
  }

  // Retrieves a user by User Id
  async getUserByUserId(userId: number): Promise<User | null> {
    return await User.findOne({
      where: { id: userId },
    });
  }
}

export default UserDao;
