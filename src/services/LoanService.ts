import LoanDao from "../dao/LoanDAO";
import Loan from "../models/Loan";
import { AllFine, BadRequestError, NotFoundError } from "../utils/Exceptions";
import AccountService from "./AccountService";
import TransactionService from "./TransactionService";

const accountService = new AccountService();
const loanDao = new LoanDao();
const transactionService = new TransactionService();

class LoanService {
  // Create New Loan with the provided information
  async createLoan(lenderMobileNumber: string, borrowerMobileNumber: string, loanAmount: number, interestRate: number, compoundingFrequency: number, loanTermInMonths: number, pin: string) {
    if (!(lenderMobileNumber && borrowerMobileNumber && loanAmount && interestRate && compoundingFrequency && loanTermInMonths)) {
      throw new BadRequestError("Invalid Credential");
    }

    const [lender, lenderAccount] = await accountService.checkAccountByMobileNumber(lenderMobileNumber);
    const [borrower, borrowerAccount] = await accountService.checkAccountByMobileNumber(borrowerMobileNumber);

    const lenderUpiId = lenderAccount.dataValues.upiId;
    const borrowerUpiId = borrowerAccount.dataValues.upiId;

    const balance = await accountService.checkBalance(lenderMobileNumber, lenderUpiId, pin);

    if (balance < loanAmount) {
      throw new BadRequestError("Loan cannot be provided due to insufficient funds in your account");
    }

    const totalPayableAmount: number = loanAmount * Math.pow(1 + interestRate / 100 / compoundingFrequency, (compoundingFrequency * loanTermInMonths) / 12);

    const loanDetails = {
      lenderId: lender.dataValues.id,
      borrowerId: borrower.dataValues.id,
      loanAmount: loanAmount,
      interestRate: interestRate,
      compoundingFrequency: compoundingFrequency,
      loanTerm: loanTermInMonths,
      totalPayableAmount: totalPayableAmount,
    };

    const loan = await loanDao.createLoan(loanDetails);
    const loanId = loan.dataValues.id;

    const transactionDetails = {
      senderUpiId: lenderUpiId,
      recipientUpiId: borrowerUpiId,
      amount: loanAmount,
      transactionType: "Loan",
      loanId: loanId,
      pin: pin,
    };

    const senderNewBalance = await transactionService.transferMoney(lenderMobileNumber, transactionDetails);
    return senderNewBalance;
  }

  // Make transaction for repayment the loan
  async loanRepayment(borrowerMobileNumber: string, lenderMobileNumber: string, amount: number, pin: string, loanId: number) {
    if (!(borrowerMobileNumber && lenderMobileNumber && amount && pin && loanId)) {
      throw new BadRequestError("Invalid Credential");
    }

    const [lender, lenderAccount] = await accountService.checkAccountByMobileNumber(lenderMobileNumber);
    const [borrower, borrowerAccount] = await accountService.checkAccountByMobileNumber(borrowerMobileNumber);

    const lenderUpiId = lenderAccount.dataValues.upiId;
    const borrowerUpiId = borrowerAccount.dataValues.upiId;

    // Check for same lender
    const loans = await loanDao.getLoans(lender.dataValues.id);
    if (!loans) {
      throw new NotFoundError("Lender has no Active Loan.");
    }
    const loanIds = loans.map((loan) => loan.dataValues.id);
    if (!loanIds.includes(loanId)) {
      throw new BadRequestError("Loan Id doesn't belongs to Lender.");
    }

    const transactionDetails = {
      senderUpiId: borrowerUpiId,
      recipientUpiId: lenderUpiId,
      amount: amount,
      transactionType: "Loan Repayment",
      loanId: loanId,
      pin: pin,
    };

    const senderNewBalance = await transactionService.transferMoney(borrowerMobileNumber, transactionDetails);
    await loanDao.updateLoan(amount, loanId);
    return senderNewBalance;
  }

  // Show all Loan which user have provided.
  async showAllLoans(mobileNumber: string): Promise<[any, string]> {
    const [user, account] = await accountService.checkAccountByMobileNumber(mobileNumber);
    const userId: any = user.dataValues.id;

    const whereDetails = { lenderId: userId };
    const allLoans = await loanDao.getAllLoans(whereDetails);
    if (!allLoans) {
      throw new AllFine("You currently do not have any active loans!");
    }
    const rawLoanData = allLoans.map((loan) => loan.dataValues);
    const loansData = JSON.stringify(rawLoanData, null, 2);
    let loansMessage: string;

    if (!allLoans.length) {
      loansMessage = "Currently, you have not provided any loan!";
    } else {
      loansMessage = `Currently, you have provided ${allLoans.length} loans!`;
    }
    return [loansData, loansMessage];
  }

  // Show all Loan which user have borrowed.
  async showAllBorrowedLoans(mobileNumber: string): Promise<[string, string]> {
    const [user, account] = await accountService.checkAccountByMobileNumber(mobileNumber);
    const userId: any = user.dataValues.id;

    const whereDetails = { borrowerId: userId };
    const allBorrowedLoans = await loanDao.getAllLoans(whereDetails);
    if (!allBorrowedLoans) {
      throw new AllFine("You currently do not have any active loans!");
    }
    const rawLoanData = allBorrowedLoans.map((loan) => loan.dataValues);
    const borrowedLoansData = JSON.stringify(rawLoanData, null, 2);
    let borrowedLoansMessage: string;

    if (!allBorrowedLoans.length) {
      borrowedLoansMessage = "Currently, you have not borrowed any loan!";
    } else {
      borrowedLoansMessage = `Currently, you have borrowed ${allBorrowedLoans.length} loans!`;
    }
    return [borrowedLoansData, borrowedLoansMessage];
  }
}

export default LoanService;
