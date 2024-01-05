import express from "express";
import { registerAdmin, authenticate } from "../controllers/adminController.js";
import {
  getAllProviders,
  toggleProviderStatus,
  getPendingRequests,
  changeRegistrationStatus,
  findActiveProviderCount,
} from "../controllers/providerController.js";
import {
  findActiveUsersCount,
  getAllUsers,
  toggleUserStatus,
} from "../controllers/userController.js";
import {
  setBanner,
  toggleAvailability,
  fetchAllPackages,
} from "../controllers/packageController.js";
import {
  findAllBookingCount,
  findTotalProfit,
  getAdminChartData,
  getAllBookings,
} from "../controllers/bookingController.js";
import { adminProtect } from "../middleware/authMiddleware.js";
import { loadChatLists } from "../controllers/messageController.js";
const router = express.Router();

// router.post("/", registerAdmin);
// router.post("/update-password", updateAdminPassword);
router.post("/auth", authenticate);
router.get("/users", adminProtect, getAllUsers);
router.get("/providers", adminProtect, getAllProviders);
router.put("/provider/change", adminProtect, changeRegistrationStatus);
router.get("/packages", adminProtect, fetchAllPackages);
router.get("/provider/pending-requests", adminProtect, getPendingRequests);
router.get("/bookings", adminProtect, getAllBookings);
router.put("/users/status-toggle", adminProtect, toggleUserStatus);
router.put("/providers/status-toggle", adminProtect, toggleProviderStatus);
router.put("/banner/set", adminProtect, setBanner);
router.put("/package/availability", adminProtect, toggleAvailability);
router.get("/messages", adminProtect, loadChatLists);
router.get("/card/booking-count", adminProtect, findAllBookingCount);
router.get("/card/profit", adminProtect, findTotalProfit);
router.get("/card/provider-count", adminProtect, findActiveProviderCount);
router.get("/card/users-count", adminProtect, findActiveUsersCount);
router.get("/chart", adminProtect, getAdminChartData);

export default router;
