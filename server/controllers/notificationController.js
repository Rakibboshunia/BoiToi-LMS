const Notification = require("../models/Notification");

// @desc    Get all notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort("-createdAt")
      .limit(50);

    res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, error: "Notification not found" });
    }

    res.status(200).json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark ALL notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    next(err);
  }
};

// Helper – called internally by other controllers to push a notification
// Usage: pushNotification(io, recipientId, { type, title, message, link })
exports.pushNotification = async (io, recipientId, payload) => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      ...payload,
    });

    // Real-time delivery via Socket.IO to the user's personal room
    io.to(recipientId.toString()).emit("new_notification", notification);
    return notification;
  } catch (err) {
    console.error("Notification push failed:", err.message);
  }
};
