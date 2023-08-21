import LoanDao from "../dao/LoanDAO";
import { BadRequestError } from "../utils/Exceptions";
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
      pin: pin
    };

    const senderNewBalance = await transactionService.transferMoney(lenderMobileNumber, transactionDetails);
    return senderNewBalance;
  }
}

export default LoanService;
