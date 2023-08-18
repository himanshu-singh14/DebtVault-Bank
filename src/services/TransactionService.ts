import TransactionDao from "../dao/TransactionDAO";
import { BadRequestError } from "../exceptions/Exceptions";
import AccountService from "./AccountService";

const transactionDao = new TransactionDao();
const accountService = new AccountService();

class TransactionService {
  // Deposit money in account by UPI ID and PIN
  async depositMoney(mobileNumber: string, upiId: string, pin: number, amount: number, transactionType: string): Promise<number> {
    if (!(mobileNumber && upiId && pin && amount && transactionType)) {
      throw new BadRequestError("Invalid Credential");
    }
    const balance = await accountService.checkBalance(mobileNumber, upiId, pin);
    const newBalance = balance + amount;
    await transactionDao.createCashTransaction(upiId, amount, transactionType);
    await transactionDao.updateBalance(upiId, newBalance);
    return newBalance;
  }

  // Withdraw money from account by UPI ID and PIN
  async withdrawMoney(mobileNumber: string, upiId: string, pin: number, amount: number, transactionType: string): Promise<number> {
    if (!(mobileNumber && upiId && pin && amount && transactionType)) {
      throw new BadRequestError("Invalid Credential");
    }
    const balance = await accountService.checkBalance(mobileNumber, upiId, pin);
    const newBalance = balance - amount;
    if (newBalance < 0) {
      throw new BadRequestError("Insufficient funds. Your account balance is not enough to complete this withdrawal.");
    }
    await transactionDao.createCashTransaction(upiId, amount, transactionType);
    await transactionDao.updateBalance(upiId, newBalance);
    return newBalance;
  }
}

export default TransactionService;
