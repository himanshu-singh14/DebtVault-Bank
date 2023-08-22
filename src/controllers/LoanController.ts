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

router.post("/loanRepayment", authenticated, async (req: Request, res: Response) => {
  try {
    const { borrowerMobileNumber, lenderMobileNumber, amount, pin, loanId } = req.body;
    const senderNewBalance = await loanService.loanRepayment(borrowerMobileNumber, lenderMobileNumber, amount, pin, loanId);
    // Send a successful response for successful repayment
    res.status(201).send(`Loan Repayment Successful!..! ₹${amount} has been debited from your account..! Your current account balance is now ₹${senderNewBalance}`);
  } catch (error) {
    // Return status code and error message for server-side error
    const typedError = error as { status: number; message: string };
    res.status(typedError.status || 500).send(typedError.message);
  }
});

router.get("/showAllLoans", authenticated, async (req: Request, res: Response) => {
  try {
    const { mobileNumber } = req.body;
    const loanData = await loanService.showAllLoans(mobileNumber);
    res.status(200).send(loanData);
  } catch (error) {
    const typedError = error as { status: number; message: string };
    res.status(typedError.status || 500).send(typedError.message);
  }
});

router.get("/showAllBorrowedLoans", authenticated, async (req: Request, res: Response) => {
  try {
    const { mobileNumber } = req.body;
    const borrowedLoanData = await loanService.showAllBorrowedLoans(mobileNumber);
    res.status(200).send(borrowedLoanData);
  } catch (error) {
    const typedError = error as { status: number; message: string };
    res.status(typedError.status || 500).send(typedError.message);
  }
});

router.get("/showAllRepaymentTransaction", authenticated, async (req: Request, res: Response) => {
  try {
    const { mobileNumber } = req.body;
    const allTransactions = await loanService.showAllRepaymentTransaction(mobileNumber);
    res.status(200).json(allTransactions);
  } catch (error) {
    const typedError = error as { status: number; message: string };
    res.status(typedError.status || 500).send(typedError.message);
  }
});

router.patch("/settleLoan", authenticated, async (req: Request, res: Response) => {
  try {
    const { mobileNumber, loanId } = req.body;
    await loanService.settleLoan(mobileNumber, loanId);
    res.status(200).send("Laon has been settled!");
  } catch (error) {
    const typedError = error as { status: number; message: string };
    res.status(typedError.status || 500).send(typedError.message);
  }
});

export default router;
