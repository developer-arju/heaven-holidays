import asyncHandler from "express-async-handler";
import Notification from "../models/notificationModel.js";
import { getBookingInfo } from "./bookingController.js";
import { io, connectedSockets } from "../server.js";

// create new notification
// helper function
export const createNotification = async (bookingId) => {
  try {
    const bookingInfo = await getBookingInfo(bookingId);
    if (bookingInfo instanceof Error) {
      throw bookingInfo;
    }
    const isExist = await Notification.findOne({
      providerId: bookingInfo.packageId.provider,
    });
    if (isExist) {
      isExist.bookingId = [...isExist.bookingId, bookingId];
      isExist.save();
    } else {
      await Notification.create({
        bookingId: [bookingId],
        providerId: bookingInfo.packageId.provider,
      });
    }

    const providerSocketId = Object.keys(connectedSockets).find(
      (key) =>
        connectedSockets[key] === bookingInfo.packageId.provider.toString()
    );

    if (providerSocketId) {
      io.to(providerSocketId).emit("new-notification", bookingInfo);
    }
  } catch (error) {
    console.log(error?.message);
  }
};

// Get Notification
// route GET /api/provider/notifications
// @access Private
export const getNotifications = asyncHandler(async (req, res) => {
  const { providerId } = req;
  try {
    const notification = await Notification.findOne({ providerId }).populate({
      path: "bookingId",
      populate: [
        { path: "packageId", select: "packageName" },
        { path: "userId", select: "-_id name" },
      ],
    });
    if (!notification || notification.bookingId.length < 1)
      throw new Error("no notification found");
    return res.status(200).json(notification.bookingId);
  } catch (error) {
    res.status(400);
    throw error;
  }
});
