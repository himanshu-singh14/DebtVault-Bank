import express, { Request, Response } from "express";
import TransactionService from "../services/TransactionService";
import authenticated from "../middlewares/Authentication";

const router = express.Router();
const transactionService = new TransactionService();

// Deposite money to bank account
router.patch("/:mobileNumber/deposit", authenticated, async (req: Request, res: Response) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    const { upiId, pin, amount, transactionType } = req.body;
    const newBalance = await transactionService.depositMoney(mobileNumber, upiId, pin, amount, transactionType);
    // Send a successful response for depositing money
    res.status(200).send(`₹${amount} have been deposited! Your current account balance is now ₹${newBalance}`);
  } catch (error) {
    // Return status code and error message for server-side error
    const typedError = error as { status: number; message: string };
    res.status(typedError.status || 500).send(typedError.message);
  }
});

// Withdraw money from bank account
router.patch("/:mobileNumber/withdraw", authenticated, async (req: Request, res: Response) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    const { upiId, pin, amount, transactionType } = req.body;
    const newBalance = await transactionService.withdrawMoney(mobileNumber, upiId, pin, amount, transactionType);
    res.status(200).send(`₹${amount} have been withdrawn! Your current account balance is now ₹${newBalance}`);
  } catch (error) {
    const typedError = error as { status: number; message: string };
    res.status(typedError.status || 500).send(typedError.message);
  }
});

// Transfer money from one account to others
router.patch("/:mobileNumber/transfer", authenticated, async (req: Request, res: Response) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    const transactionDetails = req.body;
    const { amount } = req.body;
    const newBalance = await transactionService.transferMoney(mobileNumber, transactionDetails);
    res.status(200).send(`₹${amount} have been transfered! Your current account balance is now ₹${newBalance}`);
  } catch (error) {
    const typedError = error as { status: number; message: string };
    res.status(typedError.status || 500).send(typedError.message);
  }
});

// See transaction history of deposite/withdraw/transfer/loanrepayment
router.get("/:mobileNumber/transactionHistory", authenticated, async (req: Request, res: Response) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    const { upiId, pin } = req.body;
    const history = await transactionService.transactionHistory(mobileNumber, upiId, pin);
    res.status(200).send(history);
  } catch (error) {
    const typedError = error as { status: number; message: string };
    res.status(typedError.status || 500).send(typedError.message);
  }
});

export default router;