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

// Delete account
router.delete("/:mobileNumber", async (req: Request, res: Response) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    await accountService.deleteAccountByMobileNumber(mobileNumber);
    res.status(200).send("Account deleted");
  } catch (error) {
    const typedError = error as { status: number; message: string };
    res.status(typedError.status).send(typedError.message);
  }
});

// Checking Account Balance
router.get("/:mobileNumber/checkBalance", async (req: Request, res: Response) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    const { upiId, pin } = req.body;
    const balance = await accountService.checkBalance(mobileNumber, upiId, pin);
    res.status(200).send(`Your Account Balance is ₹${balance}`);
  } catch (error) {
    const typedError = error as { status: number; message: string };
    res.status(typedError.status).send(typedError.message);
  }
});

// Showing account details
router.get("/accountDetails", async (req: Request, res: Response) => {
  try {
    const { mobileNumber } = req.body;
    const details = await accountService.showAccountDetails(mobileNumber);
    res.status(200).send(details);
  } catch (error) {
    const typedError = error as { status: number; message: string };
    res.status(typedError.status).send(typedError.message);
  }
});

// Reset account pin
router.patch("/:mobileNumber/resetAccountPin", async (req: Request, res: Response) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    const { upiId, oldPin, newPin } = req.body;
    await accountService.resetAccountPin(mobileNumber, upiId, oldPin, newPin);
    res.status(200).send(`Your account PIN has been changed!`);
  } catch (error) {
    const typedError = error as { status: number; message: string };
    res.status(typedError.status).send(typedError.message);
  }
});

export default router;