import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize.config";

interface UserAttributes {
  id?: number;
  name: string;
  mobileNumber: string;
  password: string;
  email?: string;
  address?: string;
  dateOfBirth?: Date;
  isLoggedIn?: boolean;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public mobileNumber!: string;
  public password!: string;
  public email!: string;
  public address!: string;
  public dateOfBirth!: Date;
  public isLoggedIn!: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isLoggedIn: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Set default value to true
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    modelName: "User",
  }
);

export default User;