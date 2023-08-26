import express from 'express'
import userController from "./controllers/UserController";
import accountController from "./controllers/AccountController";
import transactionController from "./controllers/TransactionController"
import loanController from "./controllers/LoanController";
import loanActivityController from "./controllers/LoanActivityController";
import User from "./models/User";
import Account from './models/Account';
import Transaction from './models/Transaction';
import Loan from './models/Loan';
import cookieParser from "cookie-parser";
import LoanActivity from './models/LoanActivity';
import InterestActivity from './models/InterestActivity';
import Notification from './models/Notification';
import sequelize from './sequelize.config';

const app = express();
app.use(express.json());
app.use(cookieParser());

// Use the controllers for specific routes
app.use("/users", userController);
app.use("/accounts", accountController);
app.use("/transactions", transactionController);
app.use("/loans", loanController);
app.use("/loanActivities", loanActivityController);

// Database sync
sequelize.sync().then(() => {
  console.log("Database synchronization completed");
})

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
