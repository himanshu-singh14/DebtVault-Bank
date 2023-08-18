import Account from "../models/Account";
import Transaction from "../models/Transaction";

class TransactionDao {
  // Create a transaction for Deposit/Withdrawal money
  async createCashTransaction(upiId: string, amount: number, transactionType: string): Promise<Transaction> {
    return await Transaction.create({ senderUpiId: upiId, recipientUpiId: upiId, amount: amount, transactionType: transactionType });
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
}

export default TransactionDao;
