import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize.config";

interface TransactionAttributes {
  id?: number;
  senderUpiId: string;
  recipientUpiId: string;
  amount: number;
  transactionType: string;
  purpose?: string;
  status?: string;
}

class Transaction extends Model<TransactionAttributes> implements TransactionAttributes {
  public id!: number;
  public senderUpiId!: string;
  public recipientUpiId!: string;
  public amount!: number;
  public transactionType!: string;
  public purpose!: string;
  public status!: string;
}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    senderUpiId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recipientUpiId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transactionType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["Withdrawal", "Deposite", "Transfer", "Loan", "Loan Repayment"]],
      },
    },
    purpose: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: [["Food", "Shopping", "Healthcare", "Entertainment", "Travel", "Utilities", "Others"]],
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Successful",
      validate: {
        isIn: [["Successful", "Pending", "Failed"]],
      },
    },
  },
  {
    sequelize,
    tableName: "transactions",
    timestamps: true,
    updatedAt: false,
    modelName: "Transaction",
  }
);

export default Transaction;
