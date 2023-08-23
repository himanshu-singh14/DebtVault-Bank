import express, { NextFunction } from 'express'
import userController from "./controllers/UserController";
import accountController from "./controllers/AccountController";
import transactionController from "./controllers/TransactionController"
import loanController from "./controllers/LoanController";
import User from "./models/User";
import Account from './models/Account';
import Transaction from './models/Transaction';
import Loan from './models/Loan';
import cookieParser from "cookie-parser";
import LoanActivity from './models/LoanActivity';

const app = express();
app.use(express.json());
app.use(cookieParser());

// Use the controllers for specific routes
app.use("/users", userController);
app.use("/accounts", accountController);
app.use("/transactions", transactionController);
app.use("/loans", loanController);

// User model sync
User.sync().then(() => {
  console.log("User table created!");
});

// Account model sync
Account.sync().then(() => {
  console.log("Account table created!");
});

// Transaction model sync
Transaction.sync({}).then(() => {
  console.log("Transaction table created!");
});

// Loan model sync
Loan.sync().then(() => {
  console.log("Loan table created!");
});

// Loan Activity model sync
LoanActivity.sync().then(() => {
  console.log("LoanActivity table created!");
});

// User and Acount One to One Association
User.hasOne(Account);
Account.belongsTo(User);

// User and Loan One to Many Association
User.hasMany(Loan, { foreignKey: "lenderId" });
Loan.belongsTo(User, { foreignKey: "lenderId" });

User.hasMany(Loan, { foreignKey: "borrowerId" });
Loan.belongsTo(User, { foreignKey: "borrowerId" });

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
