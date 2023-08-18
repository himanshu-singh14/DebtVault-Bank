import express, { Request, Response } from "express";
import TransactionService from "../services/TransactionService";

const router = express.Router();
const transactionService = new TransactionService();

router.patch("/:mobileNumber/deposite", async (req: Request, res: Response) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    const { upiId, pin, amount, transactionType } = req.body;
    const newBalance = await transactionService.depositeMoney(mobileNumber, upiId, pin, amount, transactionType);
    // Send a successful response for depositing money
    res.status(201).send(`₹${amount} has been deposited! Your current balance is now ₹${newBalance}`);
  } catch (error) {
    // Return status code and error message for server-side error
    const typedError = error as { status: number; message: string };
    res.status(typedError.status).send(typedError.message);
  }
});

export default router;