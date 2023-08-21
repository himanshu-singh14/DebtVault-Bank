import { Sequelize } from "sequelize";
import Loan from "../models/Loan";

class LoanDao {
  // Create Loan
  async createLoan(loanDetails: any): Promise<Loan> {
    return await Loan.create(loanDetails);
  }

  // Update total Repaid Amount in Loan table
  async updateLoan(amount: number, loanId: number) {
    await Loan.update(
      { totalRepaidAmount: Sequelize.literal(`totalRepaidAmount + ${amount}`) },
      {
        where: { id: loanId },
      }
    );
  }

  // Check if lender is given loan with same loan id
  async checkForSameLender(lenderId: any): Promise<Loan | null> {
    return await Loan.findOne({
      where: { lenderId: lenderId },
    });
  }
}

export default LoanDao;