import TransactionDao from "../dao/TransactionDAO";
import { BadRequestError } from "../exceptions/Exceptions";
import AccountService from "./AccountService";
import Transaction from "../models/Transaction";

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

  // Transfer money
  async transferMoney(mobileNumber: string, transactionDetails: any): Promise<number> {
    const { senderUpiId, recipientUpiId, pin, amount, transactionType } = transactionDetails;
    if (!(mobileNumber && senderUpiId && recipientUpiId && pin && amount && transactionType)) {
      throw new BadRequestError("Invalid Credential");
    }
    await accountService.checkAccountByUpiId(recipientUpiId);
    const senderBalance = await accountService.checkBalance(mobileNumber, senderUpiId, pin);
    const senderNewBalance = senderBalance - amount;
    if (senderNewBalance < 0) {
      throw new BadRequestError("Insufficient funds. Your account balance is not enough to complete this transaction.");
    }
    const transactionData: Record<string, any> = {};
    Object.entries(transactionDetails).forEach(([key, value]) => {
      if (value !== null) {
        transactionData[key] = value;
      }
    });
    await transactionDao.createTransferTransaction(transactionData);
    await transactionDao.updateBalance(senderUpiId, senderNewBalance);
    await transactionDao.justAddAmount(recipientUpiId, amount);
    return senderNewBalance;
  }

  // Transaction History
  async transactionHistory(mobileNumber: string, upiId: string, pin: number): Promise<Transaction[]> {
    if (!(mobileNumber && upiId && pin)) {
      throw new BadRequestError("Invalid Credential");
    }
    await accountService.checkUserByMobileNumber(mobileNumber);
    await accountService.checkAccountByUpiId(upiId, pin);
    await accountService.authenticateUserandAccount(mobileNumber, upiId);
    const history = await transactionDao.transactionHistory(upiId);
    return history;
  }
}

export default TransactionService;