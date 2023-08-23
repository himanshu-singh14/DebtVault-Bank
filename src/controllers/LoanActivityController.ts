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

export default router;
