import express from "express";
import {
  registerUser,
  authTokenGenerate,
  googleSign,
  resetUserPassword,
  verifyResetLink,
  updatePassword,
} from "../controllers/userController.js";
import {
  getBannerItems,
  getLatest,
  getPackages,
  getSinglePackageDetails,
} from "../controllers/packageController.js";
import {
  createBooking,
  verificationHandler,
  getUserBookings,
} from "../controllers/bookingController.js";
import { getProperties } from "../controllers/propertyController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  addFavouritePackage,
  findAllFavouritePackages,
  removeFavPackage,
} from "../controllers/favouriteController.js";
import { loadClientMessages } from "../controllers/messageController.js";

const router = express.Router();

router.post("/", registerUser);
router.get("/latest", getLatest);
router.post("/reset", resetUserPassword);
router.get("/reset/:id/:token", verifyResetLink);
router.post("/update-password", updatePassword);
router.get("/bookings", protect, getUserBookings);
router.get("/booking/:packageId", getSinglePackageDetails);
router.get("/packages", getPackages);
router.get("/properties", getProperties);
router.get("/banners", getBannerItems);
router.post("/new/package", protect, createBooking);
router.post("/new/package/verify", protect, verificationHandler);
router.post("/auth", authTokenGenerate);
router.post("/auth/google", googleSign);
router.post("/packages/save", protect, addFavouritePackage);
router.get("/favourites/packages", protect, findAllFavouritePackages);
router.put("/favourites/remove", protect, removeFavPackage);
router.get("/messages", protect, loadClientMessages);

export default router;
