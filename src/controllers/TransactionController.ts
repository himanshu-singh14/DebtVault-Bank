import express, { Request, Response } from "express";
import TransactionService from "../services/TransactionService";

const router = express.Router();
const transactionService = new TransactionService();

router.patch("/:mobileNumber/deposit", async (req: Request, res: Response) => {
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

router.patch("/:mobileNumber/withdraw", async (req: Request, res: Response) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    const { upiId, pin, amount, transactionType } = req.body;
    const newBalance = await transactionService.withdrawMoney(mobileNumber, upiId, pin, amount, transactionType);
    // Send a successful response for withdrawing money
    res.status(200).send(`₹${amount} have been withdrawn! Your current account balance is now ₹${newBalance}`);
  } catch (error) {
    // Return status code and error message for server-side error
    const typedError = error as { status: number; message: string };
    res.status(typedError.status).send(typedError.message);
  }
});

router.patch("/:mobileNumber/transfer", async (req: Request, res: Response) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    const transactionDetails = req.body;
    const { amount } = req.body;
    const newBalance = await transactionService.transferMoney(mobileNumber, transactionDetails);
    // Send a successful response for withdrawing money
    res.status(200).send(`₹${amount} have been transfered! Your current account balance is now ₹${newBalance}`);
  } catch (error) {
    // Return status code and error message for server-side error
    const typedError = error as { status: number; message: string };
    res.status(typedError.status).send(typedError.message);
  }
});

router.get("/:mobileNumber/transactionHistory", async (req: Request, res: Response) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    const { upiId, pin } = req.body;
    const history = await transactionService.transactionHistory(mobileNumber, upiId, pin);
    // Send a successful response for withdrawing money
    res.status(200).send(history);
  } catch (error) {
    // Return status code and error message for server-side error
    const typedError = error as { status: number; message: string };
    res.status(typedError.status || 500).send(typedError.message);
  }
});

export default router;