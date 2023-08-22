import Loan from "../models/Loan";
import User from "../models/User";
import Transaction from "../models/Transaction";

class LoanDao {
  // Create Loan
  async createLoan(loanDetails: any): Promise<Loan> {
    return await Loan.create(loanDetails);
  }

  // Update Loan table (Repaid/Settlement)
  async updateLoan(updateDetails: any, loanId: number) {
    await Loan.update( updateDetails ,
      {
        where: { id: loanId },
      }
    );
  }

  // Check if lender is given loan with same loan id
  async getLoans(lenderId: any): Promise<Loan[] | null> {
    return await Loan.findAll({
      where: { lenderId: lenderId, loanStatus: "Active" },
    });
  }

  // Get all loans for user from user Id
  async getAllLoans(whereDetails: any): Promise<Loan[] | null> {
    return await Loan.findAll({
      where: whereDetails,
      include: {
        model: User,
        attributes: ["name", "mobileNumber"],
      },
    });
  }

  // Get all repayment transactions for borrower from loan id
  async repaymentTransactions(loanId: number): Promise<Transaction[] | null> {
    return await Transaction.findAll({
      attributes: ["amount", "createdAt"],
      where: { loanId: loanId, transactionType: "Loan Repayment" },
    });
  }
}

export default LoanDao;