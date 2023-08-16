import express from 'express'
import userController from "./controllers/UserController";
import User from "./models/User";
import sequelize from './sequelize.config';
import Account from './models/Account';

const app = express();
app.use(express.json());

// Use the controllers for specific routes
app.use("/users", userController);

User.sync().then(() => {
  console.log("User tables created!");
});

Account.sync().then(() => {
  console.log("Account tables created!");
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
