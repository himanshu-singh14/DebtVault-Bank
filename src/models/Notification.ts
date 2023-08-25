import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize.config";

interface NotificationAttributes {
  id?: number;
  userId: number;
  message: string;
}

class Notification extends Model<NotificationAttributes> implements NotificationAttributes {
  public id!: number;
  public userId!: number;
  public message!: string;
}

Notification.init(
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
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "notifications",
    timestamps: true,
    updatedAt: false,
    modelName: "Notification",
  }
);

export default Notification;
