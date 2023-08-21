import LoanDao from "../dao/LoanDAO";
import { BadRequestError, NotFoundError } from "../utils/Exceptions";
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

    const loan = await loanDao.checkForSameLender(lender.dataValues.id);
    if (!loan) {
        throw new NotFoundError("Lender has no Active Loan.");
    } else if (!(loan.dataValues.lenderId === lender.dataValues.id)) {
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
}

export default LoanService;
