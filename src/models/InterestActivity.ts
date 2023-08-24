import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize.config";

interface InterestActivityAttributes {
  id?: number;
  loanActivityId: number;
  userId: number;
}

class InterestActivity extends Model<InterestActivityAttributes> implements InterestActivityAttributes {
  public id!: number;
  public loanActivityId!: number;
  public userId!: number;
}

InterestActivity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    loanActivityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "interestActivities",
    timestamps: true,
    updatedAt: false,
    modelName: "InterestActivity",
  }
);

export default InterestActivity;
