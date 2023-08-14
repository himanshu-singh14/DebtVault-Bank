import express from 'express'
import userController from "./controllers/UserController";
import User from "./models/User";

const app = express();
app.use(express.json());

// Use the controllers for specific routes
app.use("/users", userController);

User.sync().then(() => {
  console.log("Database and tables created!");
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
