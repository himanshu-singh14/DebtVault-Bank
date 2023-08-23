import LoanActivity from "../models/LoanActivity";

class LoanActivityDao {
  // Create Loan Activity
  async createLoanActivity(userId: number, activityType: string, loanAmount: number, interestRate: number, loanTerm: number): Promise<LoanActivity> {
    return await LoanActivity.create({
      userId: userId,
      activityType: activityType,
      loanAmount: loanAmount,
      interestRate: interestRate,
      loanTerm: loanTerm,
    });
  }

  // Update Loan Activity
  async updateLoanActivity(userId: number, id: number, details: any): Promise<[number]> {
    const activityId = await LoanActivity.update(details, {
      where: { userId: userId, id: id },
    });
    return activityId;
  }
}

export default LoanActivityDao;