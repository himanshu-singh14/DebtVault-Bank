import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize.config";

interface LoanActivityAttributes {
  id?: number;
  userId: number;
  activityType: string;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;              // Loan Term in months
  status?: string;
}

class LoanActivity extends Model<LoanActivityAttributes> implements LoanActivityAttributes {
  public id!: number;
  public userId!: number;
  public activityType!: string;
  public loanAmount!: number;
  public interestRate!: number;
  public loanTerm!: number;
  public status!: string;
}

LoanActivity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    activityType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["Offer", "Request"]],
      },
    },
    loanAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    interestRate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    loanTerm: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Open",
      validate: {
        isIn: [["Open", "Accepted", "Withdrawn"]],
      },
    },
  },
  {
    sequelize,
    tableName: "loanActivities",
    timestamps: true,
    modelName: "LoanActivity",
  }
);

export default LoanActivity;
