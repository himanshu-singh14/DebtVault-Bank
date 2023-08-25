import TransactionDao from "../dao/TransactionDAO";
import { BadRequestError } from "../utils/Exceptions";
import AccountService from "./AccountService";
import Transaction from "../models/Transaction";
import UserService from "./UserService";
import NotificationDao from "../dao/NotificationDAO";
import sequelize from "../sequelize.config";

const transactionDao = new TransactionDao();
const accountService = new AccountService();
const userService = new UserService();
const notificationDao = new NotificationDao();

class TransactionService {
  // Deposit money in account by UPI ID and PIN
  async depositMoney(mobileNumber: string, upiId: string, pin: string, amount: number, transactionType: string): Promise<number> {
    if (!(mobileNumber && upiId && pin && amount && transactionType)) {
      throw new BadRequestError("Invalid Credential");
    }
    const user = await userService.getUserByMobileNumber(mobileNumber);
    const userId: any = user.dataValues.id;

    const balance = await accountService.checkBalance(mobileNumber, upiId, pin);
    const newBalance = balance + amount;
    const transactionDetails = {
      senderUpiId: upiId,
      recipientUpiId: upiId,
      amount: amount,
      transactionType: transactionType,
    };
    
    const t = await sequelize.transaction();
    try {
      await transactionDao.createTransaction(transactionDetails, t);
      await transactionDao.updateBalance(upiId, newBalance, t);

      const message: string = `Rs.${amount} Deposited. Total Balance: Rs.${newBalance}`;
      await notificationDao.createNotification(userId, message, t);
      await t.commit();
    } catch (error) {
      await t.rollback();
    }
    return newBalance;
  }

  // Withdraw money from account by UPI ID and PIN
  async withdrawMoney(mobileNumber: string, upiId: string, pin: string, amount: number, transactionType: string): Promise<number> {
    if (!(mobileNumber && upiId && pin && amount && transactionType)) {
      throw new BadRequestError("Invalid Credential");
    }
    const user = await userService.getUserByMobileNumber(mobileNumber);
    const userId: any = user.dataValues.id;

    const balance = await accountService.checkBalance(mobileNumber, upiId, pin);
    const newBalance = balance - amount;
    if (newBalance < 0) {
      throw new BadRequestError("Insufficient funds. Your account balance is not enough to complete this withdrawal.");
    }
    const transactionDetails = {
      senderUpiId: upiId,
      recipientUpiId: upiId,
      amount: amount,
      transactionType: transactionType,
    };

    const t = await sequelize.transaction();
    try {
      await transactionDao.createTransaction(transactionDetails, t);
      await transactionDao.updateBalance(upiId, newBalance, t);

      const message: string = `Rs.${amount} Withdrawn. Total Balance: Rs.${newBalance}`;
      await notificationDao.createNotification(userId, message, t);
      await t.commit();
    } catch (error) {
      await t.rollback();
    }
    return newBalance;
  }

  // Transfer money
  async transferMoney(mobileNumber: string, transactionDetails: any): Promise<number> {
    const { senderUpiId, recipientUpiId, pin, amount, transactionType } = transactionDetails;
    if (!(mobileNumber && senderUpiId && recipientUpiId && pin && amount && transactionType)) {
      throw new BadRequestError("Invalid Credential");
    }
    const sender = await userService.getUserByMobileNumber(mobileNumber);
    const senderId: any = sender.dataValues.id;

    const recipientMobileNumber = await accountService.getMobileNumberByUpiId(recipientUpiId);
    const recipient = await userService.getUserByMobileNumber(recipientMobileNumber);
    const recipientId: any = recipient.dataValues.id;

    const recipientAccount = await accountService.checkAccountByUpiId(recipientUpiId);
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

    const t = await sequelize.transaction();
    try {
      await transactionDao.createTransaction(transactionData, t);
      await transactionDao.updateBalance(senderUpiId, senderNewBalance, t);
      await transactionDao.justAddAmount(recipientUpiId, amount, t);

      // Send notification to sender
      const senderMessage: string = `Rs.${amount} Debited from ${senderUpiId} to ${recipientUpiId}. Total Balance: Rs.${senderNewBalance}`;
      await notificationDao.createNotification(senderId, senderMessage, t);

      // Send notification to recipient
      const recipientNewBalance = recipientAccount.dataValues.balance + amount;
      const recipientMessage: string = `Rs.${amount} Credited to ${recipientUpiId} from ${senderUpiId}. Total Balance: Rs.${recipientNewBalance}`;
      await notificationDao.createNotification(recipientId, recipientMessage, t);
      await t.commit();
    } catch (error) {
      await t.rollback();
    }
    return senderNewBalance;
  }

  // Transaction History
  async transactionHistory(mobileNumber: string, upiId: string, pin: string): Promise<Transaction[]> {
    if (!(mobileNumber && upiId && pin)) {
      throw new BadRequestError("Invalid Credential");
    }
    await userService.getUserByMobileNumber(mobileNumber);
    await accountService.checkAccountByUpiId(upiId, pin);
    await accountService.authenticateUserandAccount(mobileNumber, upiId);
    const history = await transactionDao.transactionHistory(upiId);
    return history;
  }
}

export default TransactionService;