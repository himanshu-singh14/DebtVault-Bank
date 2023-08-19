import express from 'express'
import userController from "./controllers/UserController";
import accountController from "./controllers/AccountController";
import transactionController from "./controllers/TransactionController"
import User from "./models/User";
import Account from './models/Account';
import Transaction from './models/Transaction';
// import sequelize from './sequelize.config';

const app = express();
app.use(express.json());

// Use the controllers for specific routes
app.use("/users", userController);
app.use("/accounts", accountController);
app.use("/transactions", transactionController);

// User model sync
User.sync().then(() => {
  console.log("User table created!");
});

// Account model sync
Account.sync().then(() => {
  console.log("Account table created!");
});

// Transaction model sync
Transaction.sync().then(() => {
  console.log("Transaction table created!");
});

// User and Acount One to One Association
User.hasOne(Account);
Account.belongsTo(User);


// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
