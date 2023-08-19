import User from "../models/User";
import Account from "../models/Account";

class AccountDao {
  // Create Account
  async createAccount(userId: number, upiId: string, pin: string): Promise<Account> {
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

  // Delete an account by user ID from account table
  async deleteAccount(userId: number): Promise<number> {
    return await Account.destroy({
      where: { userId: userId },
    });
  }

  // Soft-delete an account by user ID from account table  --> Mocking for now
  async softDeleteAccount(userId: number): Promise<any> {
    return await Account.update(
      { status: "Closed" },
      {
        where: { userId: userId },
      }
    );
  }

  // Retrives an account by UPI ID from Account Table
  async getAccountByUpiId(upiId: string): Promise<Account | null> {
    return await Account.findOne({
      where: { upiId: upiId },
    });
  }

  // Retrives an account by User ID from Account Table
  async getAccountByUserId(userId: string): Promise<Account | null> {
    return await Account.findOne({
      where: { userId: userId },
    });
  }

  // Update PIN by UPI ID in Account Table
  async resetAccountPin(upiId: string, newPin: string): Promise<number[]> {
    return await Account.update(
      {
        pin: newPin,
      },
      {
        where: { upiId: upiId },
      }
    );
  }
}

export default AccountDao;
