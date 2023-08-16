import User from "../models/User";
import Account from "../models/Account";
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
    const user = await accountDao.getUserByMobileNumber(mobileNumber);
    if (!user) {
      throw new NotFoundError("User not found with given mobile number");
    } else if (!(user.dataValues.isLoggedIn === true)) {
      throw new NotLoggedInError("User is not Logged In");
    }
    const userId: any = user.dataValues.id;
    const account = await accountDao.getAccountByUserId(userId);
    if (account) {
      throw new AlreadyExistError("One Account already exists for this user.");
    }
    const upiId = await this.getUpiIdByMobileNumber(mobileNumber)
    await accountDao.createAccount(userId, upiId, pin);
    return upiId
  }

  // Retrieves a user by their mobile number
  async getUserIdByMobileNumber(mobileNumber: string): Promise<number> {
    const user = await accountDao.getUserByMobileNumber(mobileNumber);
    if (!user) {
      throw new NotFoundError("User not found with given mobile number");
    }
    const userId: any = user.dataValues.id;
    return userId;
  }

  // Get UPI ID from Mobile Number
  async getUpiIdByMobileNumber(mobileNumber: string): Promise<string> {
    return mobileNumber + "" + "@debtvault";
  }
}

export default AccountService;