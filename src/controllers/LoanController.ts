import express, { Request, Response } from "express";
import LoanService from "../services/LoanService";
import authenticated from "../middlewares/Authentication";

const router = express.Router();
const loanService = new LoanService();

router.post("/createLoan", authenticated, async (req: Request, res: Response) => {
  try {
    const { lenderMobileNumber, borrowerMobileNumber, loanAmount, interestRate, compoundingFrequency, loanTerm, pin } = req.body;
    const senderNewBalance = await loanService.createLoan(lenderMobileNumber, borrowerMobileNumber, loanAmount, interestRate, compoundingFrequency, loanTerm, pin);
    // Send a successful response with the created Loan
    res.status(201).send(`Loan approved!.. ₹${loanAmount} has been debited from your account!.. Your current account balance is now ₹${senderNewBalance}`);
  } catch (error) {
    // Return status code and error message for server-side error
    const typedError = error as { status: number; message: string };
    res.status(typedError.status || 500).send(typedError.message);
  }
});

export default router;
