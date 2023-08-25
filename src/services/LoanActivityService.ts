import LoanActivityDao from "../dao/LoanActivityDAO";
import LoanActivity from "../models/LoanActivity";
import { BadRequestError } from "../utils/Exceptions";
import UserService from "./UserService";
import { Op } from "sequelize";
import NotificationDao from "../dao/NotificationDAO";
import UserDao from "../dao/UserDAO";
import sequelize from "../sequelize.config";

const userService = new UserService();
const loanActivityDao = new LoanActivityDao();
const notificationDao = new NotificationDao();
const userDao = new UserDao();

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
      if (value) {
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

  // Show interest on loan offers and loan requests
  async showInterest(mobileNumber: string, loanActivityId: number) {
    if (!(mobileNumber && loanActivityId)) {
      throw new BadRequestError("Invalid Credential");
    }
    const user = await userService.getUserByMobileNumber(mobileNumber);
    const userId: any = user.dataValues.id;
    const isInterested = await loanActivityDao.checkInterest(userId, loanActivityId);
    if (isInterested) {
      throw new BadRequestError("User Already Showed interest on this Loan Activity");
    }
    const loanActivity = await loanActivityDao.getUserFromLoanActivityId(loanActivityId);
    const ownerIdOfLoanActivity: any = loanActivity?.dataValues.userId;
    const loanActivityStatus = loanActivity?.dataValues.status;
    if (ownerIdOfLoanActivity === userId) {
        throw new BadRequestError("You can't Show interest on your own Loan Activity");
    } else if (!(loanActivityStatus === "Open")) {
      throw new BadRequestError("You can't show interest on accepted or Withdrwan loan Activity");
    }

    const t = await sequelize.transaction();
    try {
      await loanActivityDao.showInterest(userId, loanActivityId, t);

      // Send Notification to user who raise loan offer/request
      const owner = await userDao.getUserByUserId(ownerIdOfLoanActivity);
      const ownerName = owner?.dataValues.name;
      const loanActivityType = loanActivity?.dataValues.activityType;
      const message: string = `${ownerName} has expressed interest in your loan ${loanActivityType} with ID: ${loanActivityId}`;
      await notificationDao.createNotification(ownerIdOfLoanActivity, message, t);
      await t.commit();
    } catch (error) {
      await t.rollback();
    }    
  }

  // View all interested users for any particular loan offer/request
  async viewAllInterestedUser(mobileNumber: string, loanActivityId: number) {
    if (!(mobileNumber && loanActivityId)) {
      throw new BadRequestError("Invalid Credential");
    }
    const user = await userService.getUserByMobileNumber(mobileNumber);
    const userId: any = user.dataValues.id;
    const allLoanActivitiesofUser = await loanActivityDao.showLoanActivity(userId);
    if (allLoanActivitiesofUser?.length === 0) {
      throw new BadRequestError("You have not created any loan offer/request yet!");
    }
    const allLoanActivityIds: any = allLoanActivitiesofUser?.map((activity) => activity.dataValues.id);
    if (!(loanActivityId in allLoanActivityIds)) {
      throw new BadRequestError("Provided loan offer/request Id is not yours. Please re-enter!");
    }
    const allusers = await loanActivityDao.viewAllInterestedUser(userId, loanActivityId);
    if (!allusers) {
      return allusers;
    }
    const interestedUsers = allusers.map((user) => user.dataValues);
    return interestedUsers;
  }

  // Removing interest for an existing intrested loan offer/request
  async removeInterest(mobileNumber: string, loanActivityId: number) {
    if (!(mobileNumber && loanActivityId)) {
      throw new BadRequestError("Invalid Credential");
    }
    const user = await userService.getUserByMobileNumber(mobileNumber);
    const userId: any = user.dataValues.id;

    const isInterested = await loanActivityDao.checkInterest(userId, loanActivityId);
    if (!isInterested) {
      throw new BadRequestError("You have not showed interest on this Activity");
    }
    await loanActivityDao.removeInterest(userId, loanActivityId);
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