import Notification from "../models/Notification";
import sequelize from "../sequelize.config";

class NotificationDao {
  // Create Notification
  async createNotification(userId: number, message: string): Promise<Notification> {
    return await Notification.create({
      userId: userId,
      message: message,
    });
  }

  // Retrieves all notifications
  async showNotifications(userId: number): Promise<object[]> {
    const notifications = await Notification.findAll({
      where: { userId: userId },
      attributes: ["message", [sequelize.literal("DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i:%s')"), "time"]],
      order: [["createdAt", "DESC"]],
    });
    return notifications.map((notification) => notification.dataValues);
  }
}

export default NotificationDao;