import LoanActivityDao from "../dao/LoanActivityDAO";
import { BadRequestError } from "../utils/Exceptions";
import UserService from "./UserService";

const userService = new UserService();
const loanActivityDao = new LoanActivityDao();

class LoanActivityService {
  // Create Loan Activity for Offering or Requesting Loan
  async createLoanActivity(mobileNumber: string, activityType: string, loanAmount: number, interestRate: number, loanTerm: number) {
    if (!(mobileNumber && activityType && loanAmount && interestRate && loanTerm)) {
      throw new BadRequestError("Invalid Credential");
    }
    const user = await userService.getUserByMobileNumber(mobileNumber);
    const userId = user.dataValues.id;

    const loanAcivityDetails = {
      userId: userId,
      activityType: activityType,
      loanAmount: loanAmount,
      interestRate: interestRate,
      loanTerm: loanTerm,
    };
    const newLoanAcivityRow = await loanActivityDao.createLoanActivity(loanAcivityDetails);
    const id = newLoanAcivityRow.dataValues.id;
    return id;
  }
}

export default LoanActivityService;