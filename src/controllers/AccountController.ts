import express, { Request, Response } from "express";
import AccountService from "../services/AccountService";

const router = express.Router();
const accountService = new AccountService();

router.post("/createAccount", async (req: Request, res: Response) => {
  try {
    const { mobileNumber, pin } = req.body;
    const upiId = await accountService.createAccount(mobileNumber, pin);
    // Send a successful response with the created account
    res.status(201).send(`Account created! Your UPI ID is ${upiId}`);
  } catch (error) {
    // Return status code and error message for server-side error
    const typedError = error as { status: number; message: string };
    res.status(typedError.status).send(typedError.message);
  }
});

export default router;