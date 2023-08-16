import UserDao from "../dao/UserDAO";
import AccountDao from "../dao/AccountDAO";
import { NotFoundError, BadRequestError, WrongPasswordError, AlreadyExistError, NotLoggedInError } from "../exceptions/Exceptions";

const userDao = new UserDao();
const accountDao = new AccountDao();

class AccountService {
  // Create New account with the provided information
  async createAccount(mobileNumber: string, pin: number): Promise<string> {
    if (!(mobileNumber && pin)) {
      throw new BadRequestError("Invalid Credential");
    }
    const userId = await this.getUserIdByMobileNumber(mobileNumber);
    const account = await accountDao.getAccountByUserId(userId);
    if (account) {
      throw new AlreadyExistError("One Account already exists for this user.");
    }
    const upiId = await this.getUpiIdByMobileNumber(mobileNumber);
    await accountDao.createAccount(userId, upiId, pin);
    return upiId;
  }

  // Retrieves a user by their mobile number
  async getUserIdByMobileNumber(mobileNumber: string): Promise<number> {
    const user = await accountDao.getUserByMobileNumber(mobileNumber);
    if (!user) {
      throw new NotFoundError("User not found with given mobile number");
    } else if (!(user.dataValues.isLoggedIn === true)) {
      throw new NotLoggedInError("User is not Logged In");
    }
    const userId: any = user.dataValues.id;
    return userId;
  }

  // Get UPI ID from Mobile Number
  async getUpiIdByMobileNumber(mobileNumber: string): Promise<string> {
    return mobileNumber + "" + "@debtvault";
  }

  // Delete account by mobile number
  async deleteAccountByMobileNumber(mobileNumber: string): Promise<any> {
    const userId = await this.getUserIdByMobileNumber(mobileNumber);
    const account = await accountDao.getAccountByUserId(userId);
    if (!account) {
      throw new NotFoundError("Account not found with given mobile number");
    }
    return await accountDao.deleteAccount(userId);
  }

  // Check balance by UPI ID and Pin
  async checkBalance(upiId: number, pin: number): Promise<number> {
    if (!(upiId && pin)) {
        throw new BadRequestError("Invalid Credential");
    }
    const account = await accountDao.getAccountByUpiId(upiId);
    if (!account) {
      throw new NotFoundError("Account not found with given UPI ID");
    } else if (!(account.dataValues.pin === pin)) {
      throw new WrongPasswordError("PIN doesn't matched! Please try again later");
    }
    const balance: any = account.dataValues.balance;
    return balance;
  }
}

export default AccountService;