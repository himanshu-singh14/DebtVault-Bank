import express, {Request, Response} from "express";
import UserService from "../services/UserService";

const router = express.Router();
const userService = new UserService();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, mobileNumber, password } = req.body;
    const user = await userService.registerUser(name, mobileNumber, password);
    // Send a successful response with the created user
    res.status(201).send(`Registration Successful for ${user?.dataValues.name}`);
  } catch (error) {
    // Return status code and error message for server-side error
     const typedError = error as { status: number; message: string };
     res.status(typedError.status).send(typedError.message);
    }
});

router.patch("/login", async (req: Request, res: Response) => {
  try {
    const { mobileNumber, password } = req.body;
    const user = await userService.loginUser(mobileNumber, password);
    res.status(200).send(`Login Successful for ${user}`);
  } catch (error) {
    const typedError = error as { status: number; message: string };
    res.status(typedError.status).send(typedError.message);
  }
});

router.get("/logout/:mobileNumber", async (req: Request, res: Response) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    const user = await userService.logout(mobileNumber);
    res.send(`${user} Logout Successfully`);
  } catch (error) {
    const typedError = error as { status: number; message: string };
    res.status(typedError.status).send(typedError.message);
  }
});

export default router;