import express from "express";
import {
  authProvider,
  registerProvider,
  registerBussiness,
  sendResetLink,
  verifyResetLink,
  updatePassword,
} from "../controllers/providerController.js";
import {
  addProperty,
  addPriceOption,
  getAllProperties,
  changePropertyStatus,
  getSinglePropertyDetails,
  updatePropertyDetails,
  findProviderPropertyCount,
} from "../controllers/propertyController.js";
import {
  addNewPackage,
  editPackageBasicInfo,
  findProviderActivePackages,
  getAllPackages,
  getSinglePackageDetails,
  toggleAvailability,
} from "../controllers/packageController.js";
import { providerProtect } from "../middleware/authMiddleware.js";
import {
  propertyImgUpload,
  logoUpload,
  packageUpload,
} from "../utils/multer.js";
import {
  changeBookingStatus,
  findRecentBookings,
  getProviderBookingCount,
  getProviderChartData,
  getProviderRevenue,
  getProviderSales,
} from "../controllers/bookingController.js";
import {
  deleteNotifications,
  getNotifications,
} from "../controllers/notificationController.js";
const router = express.Router();

router.post("/", registerProvider);
router.post("/bussiness", logoUpload.single("brandLogo"), registerBussiness);
router.post("/reset", sendResetLink);
router.get("/reset/:id/:token", verifyResetLink);
router.post("/update-password", updatePassword);
router.post("/auth", authProvider);
router.get("/property", providerProtect, getAllProperties);
router.get("/property/:id", providerProtect, getSinglePropertyDetails);
router.post(
  "/property/add",
  providerProtect,
  propertyImgUpload.array("coverImage", 8),
  addProperty
);
router.post("/property/add/:propertyId", providerProtect, addPriceOption);
router.put("/property/:propertyId", providerProtect, changePropertyStatus);
router.post(
  "/property/edit/:id",
  providerProtect,
  propertyImgUpload.array("newImages", 8),
  updatePropertyDetails
);
router.post(
  "/package/add",
  providerProtect,
  packageUpload.any(),
  addNewPackage
);
router.get("/packages", providerProtect, getAllPackages);
router.post("/package/availability", providerProtect, toggleAvailability);
router.get("/bookings", providerProtect, getProviderSales);
router.get("/notifications", providerProtect, getNotifications);
router.post("/notifications/clear", providerProtect, deleteNotifications);
router.get("/card/booking-count", providerProtect, getProviderBookingCount);
router.get("/card/revenue", providerProtect, getProviderRevenue);
router.get(
  "/card/active-packages",
  providerProtect,
  findProviderActivePackages
);
router.get("/card/property-count", providerProtect, findProviderPropertyCount);
router.get("/bookings/recent", providerProtect, findRecentBookings);
router.get("/chart", providerProtect, getProviderChartData);
router.post("/booking-status/change", providerProtect, changeBookingStatus);
router.get("/package/:packageId", providerProtect, getSinglePackageDetails);
router.post(
  "/package/edit/:packageId",
  providerProtect,
  packageUpload.any(),
  editPackageBasicInfo
);

export default router;
