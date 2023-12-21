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
} from "../controllers/propertyController.js";
import {
  addNewPackage,
  getAllPackages,
  toggleAvailability,
} from "../controllers/packageController.js";
import { providerProtect } from "../middleware/authMiddleware.js";
import {
  propertyImgUpload,
  logoUpload,
  packageUpload,
} from "../utils/multer.js";
import { getProviderSales } from "../controllers/bookingController.js";
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

export default router;
