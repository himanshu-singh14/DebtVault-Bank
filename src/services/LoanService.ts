import { Sequelize } from "sequelize";
import LoanDao from "../dao/LoanDAO";
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

    const updateDetails = { totalRepaidAmount: Sequelize.literal(`totalRepaidAmount + ${amount}`) };
    await loanDao.updateLoan(updateDetails, loanId);
    return senderNewBalance;
  }

  // Show all Loan which user have provided.
  async showAllLoans(mobileNumber: string): Promise<object> {
    const [user, account] = await accountService.checkAccountByMobileNumber(mobileNumber);
    const userId: any = user.dataValues.id;

    const whereDetails = { lenderId: userId, loanStatus: "Active" };
    const allLoans = await loanDao.getAllLoans(whereDetails);

    let loanMessage: string;
    if (allLoans?.length === 0) {
      throw new AllFine("Currently, you have not provided any loan!");
    } else {
      loanMessage = `Currently, you have provided ${allLoans?.length} loans!`;
    }
    const loanData = allLoans?.map((loan) => loan.dataValues);

    const combinedData = {
      loanMessage,
      loanData,
    };
    return combinedData;
  }

  // Show all Loan which user have borrowed.
  async showAllBorrowedLoans(mobileNumber: string): Promise<any> {
    const [user, account] = await accountService.checkAccountByMobileNumber(mobileNumber);
    const userId: any = user.dataValues.id;

    const whereDetails = { borrowerId: userId, loanStatus: "Active" };
    const allBorrowedLoans = await loanDao.getAllLoans(whereDetails);

    let borrowedLoanMessage: string;
    if (allBorrowedLoans?.length === 0) {
      throw new AllFine("Currently, you do not have any active bowwored loans!");
    } else {
      borrowedLoanMessage = `Currently, you have borrowed ${allBorrowedLoans?.length} loans!`;
    }
    const borrowedLoansData = allBorrowedLoans?.map((loan) => loan.dataValues);

    const combinedData = {
      borrowedLoanMessage,
      borrowedLoansData,
    };
    return combinedData;
  }

  // Show all repayment transaction of user have borrowed.
  async showAllRepaymentTransaction(mobileNumber: string): Promise<any> {
    const [user, account] = await accountService.checkAccountByMobileNumber(mobileNumber);
    const userId: any = user.dataValues.id;

    const whereDetails = { borrowerId: userId, loanStatus: "Active" };
    const allBorrowedLoans = await loanDao.getAllLoans(whereDetails);

    if (allBorrowedLoans?.length === 0) {
      throw new AllFine("Currently, you do not have any active bowwored loans!");
    }
    const borrowedLoanIds: any = allBorrowedLoans?.map((loan) => loan.dataValues.id);

    const combinedData = [];

    for (const loanId of borrowedLoanIds) {
      const allRawTransactions = await loanDao.repaymentTransactions(loanId);
      const allTransactions = allRawTransactions?.map((rawTransactions) => rawTransactions.dataValues);

      combinedData.push({
        loanId,
        totalInstallments: allTransactions?.length,
        transactions: allTransactions,
      });
    }
    return combinedData;
  }

  // Settle Loan 
  async settleLoan(lenderMobileNumber: string, loanId: number) {
    const [lender, account] = await accountService.checkAccountByMobileNumber(lenderMobileNumber);
    const lenderId = lender.dataValues.id;

    const loans: any = await loanDao.getLoans(lenderId);
    if (loans?.length === 0) {
      throw new NotFoundError("Lender has no Active Loan.");
    }
    const loan = loans.filter((eachLoan: any) => eachLoan.dataValues.id === loanId);
    // Check for same lender
    if (loan.length === 0) {
      throw new BadRequestError("Loan Id doesn't belongs to Lender.");
    }

    const totalPayableAmount = loan[0].dataValues.totalPayableAmount;
    const totalRepaidAmount = loan[0].dataValues.totalRepaidAmount;

    if (!(totalPayableAmount === totalRepaidAmount)) {
      throw new BadRequestError("All Installments have not been paid! Total Payable Amount should be equal to Total Repaid Amount");
    }
    const updateDetails = {
      loanStatus: "Closed"
    };
    await loanDao.updateLoan(updateDetails, loanId);
  }
}

export default LoanService;