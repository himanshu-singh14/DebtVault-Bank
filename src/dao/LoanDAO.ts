import { Op, Sequelize } from "sequelize";
import Loan from "../models/Loan";
import User from "../models/User";

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
  async getLoans(lenderId: any): Promise<Loan[] | null> {
    return await Loan.findAll({
      where: { lenderId: lenderId },
    });
  }

  // Get all loans for user from user Id
  async getAllLoans(whereDetails: any): Promise<Loan[] | null> {
    return await Loan.findAll({
      where: whereDetails,
      include: {
        model: User,
        attributes: ["name", "mobileNumber"]
      },
    });
  }
}

export default LoanDao;