export const createNotificationIntoDB = async (serviceName, content) => {
  const notification = new Notification({ serviceName, content });
  return await notification.save();
};
