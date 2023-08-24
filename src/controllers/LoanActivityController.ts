import express, { Request, Response } from "express";
import authenticated from "../middlewares/Authentication";
import LoanActivityService from "../services/LoanActivityService";

const router = express.Router();
const activityLoanService = new LoanActivityService();

// Create Loan Activity for Offering or Requesting Loan
router.post("/createLoanActivity", authenticated, async (req: Request, res: Response) => {
  try {
    const { mobileNumber, activityType, loanAmount, interestRate, loanTerm } = req.body;
    const id = await activityLoanService.createLoanActivity(mobileNumber, activityType, loanAmount, interestRate, loanTerm);
    // Send a successful response with the created Loan Activity
    res.status(201).send(`Your Loan ${activityType} has been created and Your Id is ${id}.`);
  } catch (error) {
    // Return status code and error message for server-side error
    const typedError = error as { status: number; message: string };
    res.status(typedError.status || 500).send(typedError.message);
  }
});

// Update Existing Loan Activity for Offering or Requesting Loan
router.patch("/updateLoanActivity", authenticated, async (req: Request, res: Response) => {
  try {
    const { mobileNumber, id, ...otherDetails } = req.body;
    await activityLoanService.updateLoanActivity(mobileNumber, id, otherDetails);
    res.status(200).send("Your details have been updated!");
  } catch (error) {
    const typedError = error as { status: number; message: string };
    res.status(typedError.status || 500).send(typedError.message);
  }
});

// Show all Loan offers or requests for particular user
router.get("/showLoanActivity", authenticated, async (req: Request, res: Response) => {
  try {
    const { mobileNumber } = req.body;
    const allLoanActivity = await activityLoanService.showLoanActivity(mobileNumber);
    res.status(200).json(allLoanActivity);
  } catch (error) {
    const typedError = error as { status: number; message: string };
    res.status(typedError.status || 500).send(typedError.message);
  }
});

// Search/Filter Loan offers or requests based on requirement
router.get("/searchLoanActivity", authenticated, async (req: Request, res: Response) => {
  try {
    const { mobileNumber, ...details } = req.body;
    const searchedLoanActivity = await activityLoanService.searchLoanActivity(mobileNumber, details);
    res.status(200).json(searchedLoanActivity);
  } catch (error) {
    const typedError = error as { status: number; message: string };
    res.status(typedError.status || 500).send(typedError.message);
  }
});

// Show interest on loan offers and loan requests
router.post("/showInterest", authenticated, async (req: Request, res: Response) => {
  try {
    const { mobileNumber, loanActivityId } = req.body;
    await activityLoanService.showInterest(mobileNumber, loanActivityId);
    res.status(201).send("Your interest has been submitted!");
  } catch (error) {
    const typedError = error as { status: number; message: string };
    res.status(typedError.status || 500).send(typedError.message);
  }
});

// View all interested users for any particular loan offer/request
router.get("/viewAllInterestedUser", authenticated, async (req: Request, res: Response) => {
  try {
    const { mobileNumber, loanActivityId } = req.body;
    const interestedUsers = await activityLoanService.viewAllInterestedUser(mobileNumber, loanActivityId);
    res.status(200).json(interestedUsers);
  } catch (error) {
    const typedError = error as { status: number; message: string };
    res.status(typedError.status || 500).send(typedError.message);
  }
});

export default router;
