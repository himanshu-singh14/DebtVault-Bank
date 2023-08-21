import UserDao from "../dao/UserDAO";
import AccountDao from "../dao/AccountDAO";
import { NotFoundError, BadRequestError, WrongPasswordError, AlreadyExistError, NotLoggedInError } from "../utils/Exceptions";
import Account from "../models/Account";
import User from "../models/User";
import PinHashing from "../utils/PasswordHashing";

const userDao = new UserDao();
const accountDao = new AccountDao();

class AccountService {
  // Create New account with the provided information
  async createAccount(mobileNumber: string, pin: string): Promise<string> {
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
    const hassedPin = await PinHashing.hashPassword(pin);
    await accountDao.createAccount(userId, upiId, hassedPin);
    return upiId;
  }

  // Retrieves a user by their mobile number (Check user Existance and Authenticity)
  async checkUserByMobileNumber(mobileNumber: string): Promise<User> {
    const user = await accountDao.getUserByMobileNumber(mobileNumber);
    if (!user) {
      throw new NotFoundError("User not found");
    } 
    return user;
  }

  // Check account Existance and Authenticity
  async checkAccountByUpiId(upiId: string, pin?: string): Promise<Account> {
    const account = await accountDao.getAccountByUpiId(upiId);
    if (!account) {
      throw new NotFoundError("Account not found");
    } else if (!pin) {
      return account;
    }
    const isMatched = await PinHashing.comparePassword(account.dataValues.pin, pin);
    if (!isMatched) {
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
  async checkBalance(mobileNumber: string, upiId: string, pin: string): Promise<number> {
    if (!(mobileNumber && upiId && pin)) {
      throw new BadRequestError("Invalid Credential");
    }
    await this.checkUserByMobileNumber(mobileNumber);
    const account = await this.checkAccountByUpiId(upiId, pin);
    await this.authenticateUserandAccount(mobileNumber, upiId);
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
  async resetAccountPin(mobileNumber: string, upiId: string, oldPin: string, newPin: string) {
    if (!(mobileNumber && upiId && oldPin && newPin)) {
      throw new BadRequestError("Invalid Credential");
    }
    await this.checkUserByMobileNumber(mobileNumber);
    await this.checkAccountByUpiId(upiId, oldPin);
    await this.authenticateUserandAccount(mobileNumber, upiId);
    const hassedNewPin = await PinHashing.hashPassword(newPin);
    await accountDao.resetAccountPin(upiId, hassedNewPin);
  }

  // Authentication of User and Account
  async authenticateUserandAccount(mobileNumber: string, upiId: string) {
    const user = await accountDao.getUserByMobileNumber(mobileNumber);
    const userId: any = user?.dataValues.id;
    const account = await accountDao.getAccountByUserId(userId);
    if (!account || !(account?.dataValues.upiId === upiId)) {
      throw new WrongPasswordError("You are not authenticate to do this operation!");
    }
  }
}

export default AccountService;