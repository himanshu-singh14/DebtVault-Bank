import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize.config";

interface LoanAttributes {
  id?: number;
  lenderId: number;
  borrowerId: number;
  loanAmount: number;
  interestRate: number;
  compoundingFrequency: number;
  loanTerm: number;             // Loan Term in months
  totalPayableAmount?: number;
  totalRepaidAmount?: number;
  loanType?: string;
}

class Loan extends Model<LoanAttributes> implements LoanAttributes {
  public id!: number;
  public lenderId!: number;
  public borrowerId!: number;
  public loanAmount!: number;
  public interestRate!: number;
  public compoundingFrequency!: number;
  public loanTerm!: number;
  public totalPayableAmount!: number;
  public totalRepaidAmount!: number;
  public loanType!: string;
}

Loan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    lenderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    borrowerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    loanAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    interestRate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    compoundingFrequency: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    loanTerm: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalPayableAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalRepaidAmount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    loanType: {
      type: DataTypes.STRING,
      defaultValue: "Personal",
      validate: {
        isIn: [["Personal", "Payday", "Emergency"]],
      },
    },
  },
  {
    sequelize,
    tableName: "loans",
    timestamps: true,
    modelName: "Loan",
  }
);

export default Loan;
