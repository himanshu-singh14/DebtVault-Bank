const express = require("express");
const router = express.Router();
const UserService = require("../services/user_service.js");

const userService = new UserService();

router.post("/register", async (req, res) => {
    try {
      const { name, mobileNumber, password } = req.body;
      const user = await userService.registerUser(name, mobileNumber, password);
      // Send a successful response with the created user
      res.status(201).send(user);
    } catch (error) {
      // Return status code and error message for server-side error
      const statusCode = error["statusCode"] || 500;
      const errorMessage = error["errorMessage"] || "An error occurred.";
      res.status(statusCode).send(errorMessage);
    }
});

module.exports = router;