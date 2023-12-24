import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
  bookingId: {
    type: [mongoose.Schema.Types.ObjectId || null],
    ref: "Booking",
    required: true,
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider",
    required: true,
    unique: true,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
