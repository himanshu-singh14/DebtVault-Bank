import Loan from "../models/Loan";

class LoanDao {
  // Create Loan
  async createLoan(loanDetails: any): Promise<Loan> {
    return await Loan.create(loanDetails);
  }
}

export default LoanDao;