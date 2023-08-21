import Account from "../models/Account";
import Transaction from "../models/Transaction";
import { Sequelize, Op } from "sequelize";

class TransactionDao {
  // Create a transaction
  async createTransaction(transactionData: any): Promise<Transaction> {
    return await Transaction.create(transactionData);
  }

  // Update Balance in account by UPI ID
  async updateBalance(upiId: string, newBalance: number): Promise<any> {
    await Account.update(
      { balance: newBalance },
      {
        where: { upiId: upiId },
      }
    );
  }

  // Add amount without knowing balance
  async justAddAmount(recipientUpiId: string, amount: number): Promise<any> {
    await Account.update(
      { balance: Sequelize.literal(`balance + ${amount}`) },
      {
        where: { upiId: recipientUpiId },
      }
    );
  }

  // Get Transaction History for one account
  async transactionHistory(upiId: string): Promise<Transaction[]> {
    return await Transaction.findAll({
      where: { [Op.or]: [{ senderUpiId: upiId }, { recipientUpiId: upiId }] },
    });
  }
}

export default TransactionDao;
