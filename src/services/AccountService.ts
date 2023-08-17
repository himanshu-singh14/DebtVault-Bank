import UserDao from "../dao/UserDAO";
import AccountDao from "../dao/AccountDAO";
import { NotFoundError, BadRequestError, WrongPasswordError, AlreadyExistError, NotLoggedInError } from "../exceptions/Exceptions";
import Account from "../models/Account";
import User from "../models/User";

const userDao = new UserDao();
const accountDao = new AccountDao();

class AccountService {
  // Create New account with the provided information
  async createAccount(mobileNumber: string, pin: number): Promise<string> {
    if (!(mobileNumber && pin)) {
      throw new BadRequestError("Invalid Credential");
    }
    const user = await this.checkUserByMobileNumber(mobileNumber);
    const upiId = await this.getUpiIdByMobileNumber(mobileNumber);
    const account = await accountDao.getAccountByUpiId(upiId);
    if (account) {
      throw new AlreadyExistError("One Account already exists for this user.");
    }
    const userId: any = user.dataValues.id;
    await accountDao.createAccount(userId, upiId, pin);
    return upiId;
  }

  // Retrieves a user by their mobile number (Check user Existance and Authenticity)
  async checkUserByMobileNumber(mobileNumber: string): Promise<User> {
    const user = await accountDao.getUserByMobileNumber(mobileNumber);
    if (!user) {
      throw new NotFoundError("User not found");
    } else if (!(user.dataValues.isLoggedIn === true)) {
      throw new NotLoggedInError("User is not Logged In");
    }
    return user;
  }

  // Check account Existance and Authenticity
  async checkAccountByUpiId(upiId: string, pin?: number): Promise<Account> {
    const account = await accountDao.getAccountByUpiId(upiId);
    if (!account) {
        throw new NotFoundError("Account not found");
    } else if (!pin) {
        return account
    } else if (!(account.dataValues.pin === pin)) {
        throw new WrongPasswordError("PIN doesn't matched! Please try again later");
    }
    return account;
  }

  // Get UPI ID from Mobile Number
  async getUpiIdByMobileNumber(mobileNumber: string): Promise<string> {
    return mobileNumber + "" + "@debtvault";
  }

  // Get Mobile Number from UPI ID
  async getMobileNumberByUpiId(upiId: string): Promise<string> {
    return upiId.replace("@debtvault", "");
  }

  // Delete account by mobile number
  async deleteAccountByMobileNumber(mobileNumber: string): Promise<any> {
    if (!mobileNumber) {
        throw new BadRequestError("Invalid Credential");
    }
    const user = await this.checkUserByMobileNumber(mobileNumber);
    const upiId = await this.getUpiIdByMobileNumber(mobileNumber);
    await this.checkAccountByUpiId(upiId);
    const userId: any = user.dataValues.id;
    return await accountDao.deleteAccount(userId);
  }

  // Check balance by UPI ID and Pin
  async checkBalance(upiId: string, pin: number): Promise<number> {
    if (!(upiId && pin)) {
      throw new BadRequestError("Invalid Credential");
    }
    const mobileNumber = await this.getMobileNumberByUpiId(upiId);
    await this.checkUserByMobileNumber(mobileNumber);
    const account = await this.checkAccountByUpiId(upiId, pin);
    const balance: any = account.dataValues.balance;
    return balance;
  }

  // Showing account details by mobile number
  async showAccountDetails(mobileNumber: string): Promise<Account> {
    if (!mobileNumber) {
      throw new BadRequestError("Invalid Credential");
    }
    await this.checkUserByMobileNumber(mobileNumber);
    const upiId = await this.getUpiIdByMobileNumber(mobileNumber);
    const account = await this.checkAccountByUpiId(upiId);
    return account;
  }

  // Reset account PIN by UPI ID
  async resetAccountPin(upiId: string, oldPin: number, newPin: number) {
    if (!(upiId && oldPin && newPin)) {
      throw new BadRequestError("Invalid Credential");
    }
    const mobileNumber = await this.getMobileNumberByUpiId(upiId);
    await this.checkUserByMobileNumber(mobileNumber);
    await this.checkAccountByUpiId(upiId, oldPin);
    await accountDao.resetAccountPin(upiId, newPin);
  }
}

export default AccountService;