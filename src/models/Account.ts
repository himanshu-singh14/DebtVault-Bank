import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize.config";

interface AccountAttributes {
  id?: number;
  userId: number;     // Foreign key of User table
  upiId: string;      // Account Number(Enter mobile number here)
  balance?: number;
  pin: number;        // 4 digit Pin
  status?: string;     // Active or Closed
}

class Account extends Model<AccountAttributes> implements AccountAttributes {
  public id!: number;
  public userId!: number;
  public upiId!: string;
  public balance!: number;
  public pin!: number;
  public status!: string;
}

Account.init(
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
    upiId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    balance: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    pin: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Active",
      validate: {
        isIn: [["Active", "Closed"]],
      },
    },
  },
  {
    sequelize,
    tableName: "accounts",
    timestamps: true,
    modelName: "Account",
  }
);

export default Account;
