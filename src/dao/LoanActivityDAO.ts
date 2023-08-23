import LoanActivity from "../models/LoanActivity";

class LoanActivityDao {
  // Create Loan Activity
  async createLoanActivity(createLoanActivity: any): Promise<LoanActivity> {
    return await LoanActivity.create(createLoanActivity);
  }
}

export default LoanActivityDao;