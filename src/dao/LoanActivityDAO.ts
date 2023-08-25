import InterestActivity from "../models/InterestActivity";
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

  // Show all Loan offers or requests for particular user
  async showLoanActivity(userId: number): Promise<LoanActivity[] | null> {
    return await LoanActivity.findAll({
      where: { userId: userId },
    });
  }

  // Show all Loan offers or requests for particular user
  async searchLoanActivity(whereConditions: any): Promise<LoanActivity[] | null> {
    return await LoanActivity.findAll({
      where: whereConditions,
      attributes: ["id", "userId", "loanAmount", "interestRate", "loanTerm", "createdAt"],
    });
  }

  // Create Interest Activity
  async showInterest(userId: number, loanActivityId: number, transaction: any) {
    return await InterestActivity.create(
      {
        userId: userId,
        loanActivityId: loanActivityId,
      },
      { transaction }
    );
  }

  // Check Interest Activity
  async checkInterest(userId: number, loanActivityId: number): Promise<InterestActivity | null> {
    return await InterestActivity.findOne({
      where: { userId: userId, loanActivityId: loanActivityId },
    });
  }

  // Find all interested users on any particular loan offer/request
  async viewAllInterestedUser(userId: number, loanActivityId: number): Promise<InterestActivity[] | null> {
    return await InterestActivity.findAll({
      where: { userId: userId, loanActivityId: loanActivityId },
      attributes: ["userId", "createdAt"],
    });
  }

  // Removing interest for an existing intrested loan offer/request
  async removeInterest(userId: number, loanActivityId: number) {
    return await InterestActivity.destroy({
      where: { userId: userId, loanActivityId: loanActivityId },
    });
  }

  // Find User through Loan Activity Id
  async getUserFromLoanActivityId(loanActivityId: number): Promise<LoanActivity | null> {
    return await LoanActivity.findOne({
      where: { id: loanActivityId },
    });
  }
}

export default LoanActivityDao;
