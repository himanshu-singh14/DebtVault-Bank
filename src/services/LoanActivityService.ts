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
    const userId: any = user.dataValues.id;

    const newLoanAcivityRow = await loanActivityDao.createLoanActivity(userId, activityType, loanAmount, interestRate, loanTerm);
    const id = newLoanAcivityRow.dataValues.id;
    return id;
  }

  // Update Loan Activity for Offering or Requesting Loan
  async updateLoanActivity(mobileNumber: string, id: number, details: any) {
    const user = await userService.getUserByMobileNumber(mobileNumber);
    const userId: any = user.dataValues.id;
    const activityId = await loanActivityDao.updateLoanActivity(userId, id, details);
    if(activityId[0] === 0) {
        throw new BadRequestError("Not editable!");
    }
  }
}

export default LoanActivityService;