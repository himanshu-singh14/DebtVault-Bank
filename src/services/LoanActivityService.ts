import LoanActivityDao from "../dao/LoanActivityDAO";
import LoanActivity from "../models/LoanActivity";
import { BadRequestError } from "../utils/Exceptions";
import UserService from "./UserService";
import { Op } from "sequelize";

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
    if (activityId[0] === 0) {
      throw new BadRequestError("Not editable!");
    }
  }

  // Show all Loan offers or requests for particular user
  async showLoanActivity(mobileNumber: string): Promise<LoanActivity[] | null> {
    const user = await userService.getUserByMobileNumber(mobileNumber);
    const userId: any = user.dataValues.id;
    return await loanActivityDao.showLoanActivity(userId);
  }

  // Search/Filter Loan offers or requests
  async searchLoanActivity(mobileNumber: string, details: any): Promise<LoanActivity[] | null> {
    const user = await userService.getUserByMobileNumber(mobileNumber);
    const userId: any = user.dataValues.id;

    const whereConditions: any = {};
    whereConditions.status = "Open";

    for (const key in details) {
      const value = details[key];
      if(value) {
        switch (key) {
            case "activityTypeOffer":
            whereConditions.activityType = "Offer";
            break;
            case "activityTypeRequest":
            whereConditions.activityType = "Request";
            break;
            case "lessThanLoanAmount":
            whereConditions.loanAmount = { [Op.lte]: [value] };
            break;
            case "greaterThanLoanAmount":
            whereConditions.loanAmount = { [Op.gte]: [value] };
            break;
            case "betweenLoanAmount":
            const [minAmount, maxAmount] = value.split("<");
            whereConditions.loanAmount = { [Op.between]: [minAmount, maxAmount] };
            break;
            case "lessThanIntrestRate":
            whereConditions.interestRate = { [Op.lte]: [value] };
            break;
            case "greaterThanIntrestRate":
            whereConditions.interestRate = { [Op.gte]: [value] };
            break;
            case "betweenIntrestRate":
            const [minIntrestRate, maxIntrestRate] = value.split("<");
            whereConditions.interestRate = { [Op.between]: [minIntrestRate, maxIntrestRate] };
            break;
            case "lessThanLoanTerm":
            whereConditions.loanTerm = { [Op.lte]: [value] };
            break;
            case "greaterThanLoanTerm":
            whereConditions.loanTerm = { [Op.gte]: [value] };
            break;
            case "betweenLoanTerm":
            const [minLoanTerm, maxLoanTerm] = value.split("<");
            whereConditions.loanTerm = { [Op.between]: [minLoanTerm, maxLoanTerm] };
            break;
        }
      }
    }
    return await loanActivityDao.searchLoanActivity(whereConditions);
  }
}

export default LoanActivityService;

/** 
 * For Search : You can make any of the filter based on requirement.
{
  "activityType": null,
  "activityTypeOffer": "Offer",
  "activityTypeRequest": "Request",
  "loanAmount": null,
  "lessThanLoanAmount": 150000,
  "greaterThanLoanAmount": 50000,
  "betweenLoanAmount": 50000<150000,
  "intrestRate": null,
  "lessThanIntrestRate": 12,
  "greaterThanIntrestRate": 18,
  "betweenIntrestRate": 12<18,
  "loanTerm": null,
  "lessThanLoanTerm": 10,
  "greaterThanLoanTerm": 15,
  "betweenLoanTerm": 10<15,
}
*/