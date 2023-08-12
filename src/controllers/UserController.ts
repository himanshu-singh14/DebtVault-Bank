import express, {Request, Response} from "express";
import UserService from "../services/UserService";

const router = express.Router();
const userService = new UserService();

router.post("/register", async (req: Request, res: Response) => {
    try {
      const { name, mobileNumber, password } = req.body;
      const user = await userService.registerUser(name, mobileNumber, password);
      // Send a successful response with the created user
    res.status(201).send(user);
    } catch (error) {
      // Return status code and error message for server-side error
      // @ts-ignore
      const statusCode = error["statusCode"] || 500; // @ts-ignore
      const errorMessage = error["errorMessage"] || "An error occurred.";
      res.status(statusCode).send(errorMessage);
    }
});

export default router;