import User from "../models/User";
import Account from "../models/Account";

class AccountDao {
  // Create Account
  async createAccount(userId: number, upiId: string, pin: number): Promise<Account> {
    try {
      return await Account.create({ upiId: upiId, userId: userId, pin: pin });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  // Retrieves a user by their mobile number from User Table
  async getUserByMobileNumber(mobileNumber: string): Promise<User | null> {
    return await User.findOne({
      where: { mobileNumber: mobileNumber },
    });
  }

  // Retrives an account by their user ID from Account Table
  async getAccountByUserId(userId: number): Promise<Account | null> {
    return await Account.findOne({
      where: { userId: userId },
    });
  }
}

export default AccountDao;
