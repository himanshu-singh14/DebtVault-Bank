import UserDao from "../dao/UserDAO";
import TransactionDao from "../dao/TransactionDAO";
import {  BadRequestError } from "../exceptions/Exceptions";
import AccountService from "./AccountService";

const transactionDao = new TransactionDao();
const accountService = new AccountService();

class TransactionService {
  // Deposit money in account by UPI ID and PIN
  async depositeMoney(mobileNumber: string, upiId: string, pin: number, amount: number, transactionType: string): Promise<number> {
    if (!(mobileNumber && upiId && pin && amount && transactionType)) {
      throw new BadRequestError("Invalid Credential");
    }
    const balance = await accountService.checkBalance(mobileNumber, upiId, pin);
    const newBalance = balance + amount;
    await transactionDao.updateBalance(upiId, newBalance);
    await transactionDao.createCashTransaction(upiId, amount, transactionType);
    return newBalance
  }
}

export default TransactionService;