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
    const user = await userService.login(mobileNumber, password);
    res.status(200).send(`Login Successful for ${user}`);
  } catch (error) {
    const typedError = error as { status: number; message: string };
    res.status(typedError.status).send(typedError.message);
  }
});

router.patch("/logout/:mobileNumber", async (req: Request, res: Response) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    const user = await userService.logout(mobileNumber);
    res.status(200).send(`${user} Logout Successfully`);
  } catch (error) {
    const typedError = error as { status: number; message: string };
    res.status(typedError.status).send(typedError.message);
  }
});

// Change password
router.patch("/users/:mobileNumber/change-password", async (req: Request, res: Response) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    const { oldPassword, newPassword } = req.body;
    const user = await userService.changePassword(mobileNumber, oldPassword, newPassword);
    res.status(200).send(`Password got changed for ${user}`);
  } catch (error) {
    const typedError = error as { status: number; message: string };
    res.status(typedError.status).send(typedError.message);
  }
});

// Update details
router.patch("/users/:mobileNumber/details", async (req: Request, res: Response) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    const details: any = req.body;
    const user = await userService.changeUserDetails(mobileNumber, details);
    res.status(200).send(`Details got changed for ${user}`);
  } catch (error) {
    const typedError = error as { status: number; message: string };
    res.status(typedError.status).send(typedError.message);
  }
});

// Show all users
router.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await userService.showAllUsers();
    res.status(200).json(users);
  } catch (error) {
    const typedError = error as { status: number; message: string };
    res.status(typedError.status).send(typedError.message);
  }
});

// Show user by mobile number
router.get("/users/:mobileNumber", async (req: Request, res: Response) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    const user = await userService.getUserByMobileNumber(mobileNumber);
    res.status(200).send(user);
  } catch (error) {
    const typedError = error as { status: number; message: string };
    res.status(typedError.status).send(typedError.message);
  }
});

// Delete user
router.delete("/delete/:mobileNumber", async (req: Request, res: Response) => {
  try {
    const mobileNumber = req.params.mobileNumber;
    const user = await userService.deleteUserByMobileNumber(mobileNumber);
    res.status(200).send("User deleted");
  } catch (error) {
    const typedError = error as { status: number; message: string };
    res.status(typedError.status).send(typedError.message);
  }
});

export default router;