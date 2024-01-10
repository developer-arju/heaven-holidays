import Booking from "../models/bookingModel.js";
import asyncHandler from "express-async-handler";
import { getPackage } from "./packageController.js";
import mongoose from "mongoose";
import { createNotification } from "./notificationController.js";
import {
  createOrder,
  verifyPayment,
  getOrderDetails,
} from "../utils/razorpay.js";

// @desc Create Booking and initialize payment
// route POST /api/users/new/package
// @access Private
export const createBooking = asyncHandler(async (req, res) => {
  const { startDate, packageId, form } = req.body;
  const { userId } = req;
  const { title, name, documentName, documentNumber } = form;
  try {
    const currentBookings = await Booking.find({ isPaid: true });
    const newBookingDate = new Date(startDate);
    let count = 0;

    currentBookings.forEach((booking) => {
      const currentBookingDate = new Date(booking.startDate);
      if (booking.packageId.toString() === packageId) {
        if (
          newBookingDate.toDateString() === currentBookingDate.toDateString()
        ) {
          count += 1;
        }
      }
    });
    if (count >= parseInt(process.env.DAILY_BOOKING_LIMIT)) {
      throw new Error(
        "package booking limit exceeds please try another date for book this package"
      );
    }

    const bookItem = await getPackage(packageId);
    const newBooking = await Booking.create({
      userId,
      packageId,
      startDate,
      identityProof: {
        title,
        name,
        documentName,
        documentNumber,
      },
      status: "booked",
    });
    if (!newBooking) {
      throw new Error({ message: "Booking failed" });
    }
    const order = await createOrder(newBooking._id, bookItem.price, form);
    if (order) {
      return res.status(200).json(order);
    }
  } catch (error) {
    res.status(400);
    throw error;
  }
});

// @desc Verify Payment
// route POST /api/users/new/package/verify
// @access Private
export const verificationHandler = asyncHandler(async (req, res) => {
  try {
    const verify = verifyPayment(req.body);
    if (!verify) {
      throw new Error("payment verification failed");
    }
    const order = await getOrderDetails(req.body.razorpay_order_id);
    if (order) {
      await Booking.updateOne(
        { _id: order.receipt },
        {
          $set: {
            isPaid: true,
            paymentInfo: req.body,
            paidAmount: order.amount / 100,
          },
        }
      );
      createNotification(order.receipt);
      return res.status(200).json({ bookingId: order.receipt });
    }
    throw new Error("booking updation failed");
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

// @desc Send user bookings
// route GET /api/users/bookings
// @access Private
export const getUserBookings = asyncHandler(async (req, res) => {
  const { userId } = req;
  try {
    const bookings = await Booking.find({ userId, isPaid: true }).populate({
      path: "packageId",
      populate: {
        path: "provider",
        select: "brandName",
      },
    });
    if (!bookings) {
      throw new Error("your bookings not found");
    }
    return res.status(200).json(bookings);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error?.message });
  }
});

// @desc Get all documents
// route GET /api/admin/bookings
// @access Private
export const getAllBookings = asyncHandler(async (req, res) => {
  try {
    const bookings = await Booking.find({ isPaid: true }).populate([
      {
        path: "userId",
        select: "-password -_id",
      },
      {
        path: "packageId",
        select: "-_id",
        populate: {
          path: "provider",
          select: "-_id -password",
        },
      },
    ]);
    if (!bookings) throw new Error("bookings not found");

    return res.status(200).json(bookings);
  } catch (error) {
    res.status(400);
    throw error;
  }
});

// @desc Provider Bookings
// route GET /api/provider/bookings
// @access Private
export const getProviderSales = asyncHandler(async (req, res) => {
  const { providerId } = req;

  try {
    const bookings = await Booking.find({ isPaid: true }).populate("packageId");
    if (bookings.length < 1) throw new Error("can't find any bookings");

    const providerSale = bookings.filter(
      (doc) => doc.packageId.provider.toString() === providerId
    );
    if (providerSale.length < 1) throw new Error("can't find any bookings");

    res.status(200).json(providerSale);
  } catch (error) {
    res.status(400);
    throw error;
  }
});

// @desc Find provider booking count
// route GET /api/provider/card/booking-count
// @access Private
export const getProviderBookingCount = asyncHandler(async (req, res) => {
  const { providerId } = req;
  try {
    const bookings = await Booking.find({ isPaid: true }).populate("packageId");
    const bookingCount = bookings.reduce((acc, booking) => {
      if (booking.packageId.provider.toString() === providerId) {
        return acc + 1;
      }
      return acc;
    }, 0);

    return res.status(200).json({ bookingCount });
  } catch (error) {
    console.log(error);
    res.status(400);
    throw error;
  }
});

// @desc Find provider revenue
// route GET /api/provider/card/revenue
// @access Private
export const getProviderRevenue = asyncHandler(async (req, res) => {
  const { providerId } = req;
  try {
    const bookings = await Booking.find().populate("packageId");
    const totalProfit = bookings.reduce((acc, booking) => {
      if (
        booking.packageId.provider.toString() === providerId &&
        booking.isPaid
      ) {
        return acc + booking?.paidAmount;
      }
      return acc;
    }, 0);

    return res.status(200).json({ totalProfit });
  } catch (error) {
    res.status(400);
    throw error;
  }
});

// @desc Get recent bookings of a provider
// route GET /api/provider/bookings/recent
// @access Private
export const findRecentBookings = asyncHandler(async (req, res) => {
  const { providerId } = req;
  const currDate = new Date();
  const oneWeekAgo = new Date(currDate);
  oneWeekAgo.setDate(currDate.getDate() - 6);
  oneWeekAgo.setHours(0, 0, 0, 0);
  try {
    const recentBookings = await Booking.aggregate([
      {
        $match: {
          createdAt: {
            $gte: oneWeekAgo,
            $lt: currDate,
          },
        },
      },
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "_id",
          as: "package",
        },
      },
      {
        $match: {
          $expr: {
            $and: [
              {
                $eq: [
                  new mongoose.Types.ObjectId(providerId),
                  { $arrayElemAt: ["$package.provider", 0] },
                ],
              },
              { $eq: [true, "$isPaid"] },
            ],
          },
        },
      },
    ]);

    res.status(200).json(recentBookings);
  } catch (error) {
    console.log(error);
    res.status(400);
    throw error;
  }
});

// @desc Find all booking count for admin dashboard
// route GET /api/admin/card/booking-count
// @access Private
export const findAllBookingCount = asyncHandler(async (req, res) => {
  try {
    const bookingCount = await Booking.aggregate([
      { $match: { isPaid: true } },
      { $count: "bookingCount" },
    ]);
    return res.status(200).json(bookingCount[0]);
  } catch (error) {
    console.log(error);
    res.status(400);
    throw error;
  }
});

// @desc Find total profit for admin dashboard
// route GET /api/admin/card/profit
// @access Private
export const findTotalProfit = asyncHandler(async (req, res) => {
  try {
    const totalProfit = await Booking.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalProfit: { $sum: "$paidAmount" } } },
      { $project: { _id: 0, totalProfit: 1 } },
    ]);

    return res.status(200).json(totalProfit[0]);
  } catch (error) {
    console.log(error);
    res.status(400);
    throw error;
  }
});

// @desc Get Chart Data for Admin Dashboard
// route GET /api/admin/chart
// @access Private
export const getAdminChartData = asyncHandler(async (req, res) => {
  try {
    const currDate = new Date();
    const currYear = currDate.getFullYear();
    let adjYear;
    const currMonth = currDate.getMonth();
    if (currMonth < 3) {
      adjYear = currYear - 1;
    } else {
      adjYear = currYear + 1;
    }
    const paidBookings = await Booking.find({ isPaid: true });
    const chartData = {};
    const result = new Array(12).fill(0);

    paidBookings.forEach((booking) => {
      const bookedDate = new Date(booking.createdAt);
      let month;
      if (bookedDate.getFullYear() === currYear) {
        if (currYear < adjYear) {
          if (bookedDate.getMonth() > 1) {
            month = bookedDate.getMonth();
          }
        } else if (currYear > adjYear) {
          if (bookedDate.getMonth() < 2) {
            month = bookedDate.getMonth();
          }
        }
      } else if (bookedDate.getFullYear() === adjYear) {
        if (currYear < adjYear) {
          if (bookedDate.getMonth() < 2) {
            month = bookedDate.getMonth();
          }
        } else if (currYear > adjYear) {
          if (bookedDate.getMonth() > 1) {
            month = bookedDate.getMonth();
          }
        }
      }

      if (month || month === 0) {
        if (chartData.hasOwnProperty(month)) {
          chartData[month] += booking.paidAmount;
        } else {
          chartData[month] = booking.paidAmount;
        }
      }
    });
    console.log(chartData);
    for (let key in chartData) {
      let idx = parseInt(key) + 10;
      if (idx > 11) {
        idx = idx - 12;
      }
      result[idx] = chartData[key];
    }
    return res.status(200).json({ currYear, adjYear, result });
  } catch (error) {
    console.log(error);
    res.status(400);
    throw error;
  }
});

// @desc Get Provider Chart Data
// route GET /api/provider/chart
// @access Private
export const getProviderChartData = asyncHandler(async (req, res) => {
  const { providerId } = req;
  try {
    let adjYear;
    const currDate = new Date();
    const currYear = currDate.getFullYear();
    const currMonth = currDate.getMonth();
    if (currMonth < 3) {
      adjYear = currYear - 1;
    } else {
      adjYear = currYear + 1;
    }
    const chartData = {};
    const result = new Array(12).fill(0);

    const paidBookings = await Booking.aggregate([
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "_id",
          as: "package",
        },
      },
      {
        $match: {
          $expr: {
            $and: [
              {
                $eq: [
                  new mongoose.Types.ObjectId(providerId),
                  { $arrayElemAt: ["$package.provider", 0] },
                ],
              },
              { $eq: [true, "$isPaid"] },
            ],
          },
        },
      },
    ]);

    paidBookings.forEach((booking) => {
      const bookedDate = new Date(booking.createdAt);
      let month;
      if (bookedDate.getFullYear() === currYear) {
        if (currYear < adjYear) {
          if (bookedDate.getMonth() > 1) {
            month = bookedDate.getMonth();
          }
        } else if (currYear > adjYear) {
          if (bookedDate.getMonth() < 2) {
            month = bookedDate.getMonth();
          }
        }
      } else if (bookedDate.getFullYear() === adjYear) {
        if (currYear < adjYear) {
          if (bookedDate.getMonth() < 2) {
            month = bookedDate.getMonth();
          }
        } else if (currYear > adjYear) {
          if (bookedDate.getMonth() > 1) {
            month = bookedDate.getMonth();
          }
        }
      }

      if (month || month === 0) {
        if (chartData.hasOwnProperty(month)) {
          chartData[month] += booking.paidAmount;
        } else {
          chartData[month] = booking.paidAmount;
        }
      }
    });

    for (let key in chartData) {
      let idx = parseInt(key) + 10;
      if (idx > 11) {
        idx = idx - 12;
      }
      result[idx] = chartData[key];
    }
    return res.status(200).json({ currYear, adjYear, result });
  } catch (error) {
    console.log(error);
    res.status(400);
    throw error;
  }
});

// @desc Change booking status
// route POST /api/provider/booking-status/change
// @access Private
export const changeBookingStatus = asyncHandler(async (req, res) => {
  const { dataValue, bookingId } = req.body;

  try {
    if (dataValue !== "on-going" && dataValue !== "complete")
      throw new Error("data value not match our rules");

    const booking = await Booking.findById(bookingId);
    booking.status = dataValue;
    await booking.save();
    return res
      .status(200)
      .json({ bookingId, message: `booking status changed to ${dataValue}` });
  } catch (error) {
    console.log(error);
    res.status(400);
    throw error;
  }
});

// @desc Get Single booking info
// route GET /api/provider/booking/view/:id
// @access Private
export const getSingleBookingInfo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const select = await Booking.findById(id).populate("userId packageId");

    return res.status(200).json(select);
  } catch (error) {
    console.log(error);
    res.status(400);
    throw error;
  }
});

// retrive booking info by ID
// helper function
export const getBookingInfo = async (id) => {
  try {
    const booking = await Booking.findOne({ _id: id }).populate([
      { path: "packageId" },
      { path: "userId", select: "-_id name" },
    ]);
    if (!booking) throw new Error("invalid id");
    return booking;
  } catch (error) {
    return error;
  }
};
