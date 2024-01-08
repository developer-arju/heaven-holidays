import asyncHandler from "express-async-handler";
import Package from "../models/packageModel.js";
import fs from "fs";

// @desc Add new Package
// route POST /api/provider/package/add
// @access Private
export const addNewPackage = asyncHandler(async (req, res) => {
  const { providerId } = req;
  const images = req.files;
  const {
    packageName,
    dayCount,
    nightCount,
    summary,
    phoneNumbers,
    adults,
    children,
    price,
  } = req.body;
  let { dailySchedules } = req.body;
  dailySchedules = JSON.parse(dailySchedules);

  dailySchedules.forEach((day, index) => {
    const activityImages = images.filter((img) => {
      if (img.fieldname === `Day${index + 1}-activity`) {
        return img;
      }
    });
    const foodImages = images.filter((img) => {
      if (img.fieldname === `Day${index + 1}-foods`) {
        return img;
      }
    });
    const stayImage = images.filter((img) => {
      if (img.fieldname === `Day${index + 1}-property`) {
        return img;
      }
    });
    if (stayImage.length > 0) {
      day.accomodation.image = `${stayImage[0]?.destination
        .split("/")
        .slice(2)
        .join("/")}/${stayImage[0]?.filename}`;
    } else {
      day.accomodation.image = "";
    }
    if (activityImages.length > 0) {
      day.activity.forEach((item, i) => {
        const dest = activityImages[i].destination
          .split("/")
          .slice(2)
          .join("/");
        item.image = `${dest}/${activityImages[i].filename}`;
      });
    }
    if (foodImages.length > 0) {
      day.foodOptions.forEach((item, i) => {
        const dest = foodImages[i].destination.split("/").slice(2).join("/");
        item.image = `${dest}/${foodImages[i].filename}`;
      });
    }
  });

  const coverImage = images.filter((img) => {
    if (img.fieldname === "coverImage") {
      return img;
    }
  });

  try {
    const newPackage = await Package.create({
      provider: providerId,
      packageName,
      dayCount: parseInt(dayCount),
      nightCount: parseInt(nightCount),
      summary,
      adults: parseInt(adults),
      children: parseInt(children),
      phoneNumbers: phoneNumbers.filter((num) => num !== ""),
      price,
      coverImage: coverImage.map((img) => {
        const dest = img.destination.split("/").slice(2).join("/");
        return `${dest}/${img.filename}`;
      }),
      dailySchedules,
    });

    if (newPackage) {
      return res.status(200).json(newPackage);
    }
  } catch (error) {
    console.log(error);
    res.status(200);
    throw error;
  }
});

// @desc Retrive all packages listed under provider
// route GET /api/provider/packages
// @access Private
export const getAllPackages = asyncHandler(async (req, res) => {
  const { providerId } = req;
  try {
    const packages = await Package.find({ provider: providerId });
    if (packages) {
      return res.status(200).json(packages);
    }
  } catch (error) {
    console.log(error);
    res.status(400);
    throw error;
  }
});

// @desc Send packages
// route GET /api/users/packages
// @access Public
export const getPackages = asyncHandler(async (req, res) => {
  const { search } = req.query;
  let packages;
  try {
    if (search === "" || search === undefined) {
      packages = await Package.find({ isAvailable: true }).populate(
        "provider",
        "brandName"
      );
    } else {
      packages = await Package.aggregate([
        {
          $match: {
            $or: [
              { packageName: { $regex: search, $options: "i" } },
              {
                "accomodation.location": {
                  $regex: search,
                  $options: "i",
                },
              },
              {
                activity: {
                  $elemMatch: {
                    $or: [
                      { location: { $regex: search, $options: "i" } },
                      { description: { $regex: search, $options: "i" } },
                    ],
                  },
                },
              },
            ],
            isAvailable: true,
          },
        },
      ]).exec();
    }
    if (packages.length < 1) {
      throw new Error("packages not found");
    }
    return res.status(200).json(packages);
  } catch (error) {
    return res.status(400).json({ message: error?.message });
  }
});

// @desc Send Single Package Details
// route GET /api/users/booking/:packageId || /api/provider/package:packageId
// @access Public
export const getSinglePackageDetails = asyncHandler(async (req, res) => {
  const { packageId } = req.params;
  try {
    const selected = await Package.findById(packageId).populate(
      "provider",
      "brandName"
    );
    if (!selected) throw new Error("data is empty");

    return res.status(200).json(selected);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// @desc Send Latest 5 packages
// route GET /api/users/latest
// @access Public
export const getLatest = asyncHandler(async (req, res) => {
  try {
    const latest = await Package.find({ isAvailable: true })
      .sort({ _id: -1 })
      .limit(5)
      .populate("provider", "brandName");
    if (!latest) throw new Error("packages not found");
    return res.status(200).json(latest);
  } catch (error) {
    res.status(404);
    throw error;
  }
});

// @desc Set Banner Packages
// route PUT /api/admin/banner/set
// @access Private
export const setBanner = asyncHandler(async (req, res) => {
  const { packageId, status } = req.body;
  try {
    if (status) {
      const selected = await Package.find({ banner: true });
      if (selected && selected.length >= 5)
        throw new Error("maximum banner options reached");
    }

    const processed = await Package.updateOne(
      { _id: packageId },
      { $set: { banner: status } }
    );
    return res.status(200).json(processed);
  } catch (error) {
    res.status(403);
    throw error;
  }
});

// @desc Change Package Availability
// route PUT /api/admin/package/availability || /api/provider/package/availability
// @access Private
export const toggleAvailability = asyncHandler(async (req, res) => {
  const { packageId } = req.body;
  try {
    const exist = await Package.findById(packageId);
    if (!exist) throw new Error("given id not matches any records");

    exist.isAvailable = !exist.isAvailable;
    const saved = await exist.save();
    if (!saved) throw new Error("operation failed");
    return res.status(200).json(saved);
  } catch (error) {
    res.status(404);
    throw error;
  }
});

// @desc Send Banner Items
// route GET /api/users/banners
// @access Public
export const getBannerItems = asyncHandler(async (req, res) => {
  try {
    const banners = await Package.find({ banner: true, isAvailable: true });
    if (!banners) throw new Error("no packages set as banner");

    return res.status(200).json(banners);
  } catch (error) {
    res.status(403);
    throw error;
  }
});

// @desc Get All Packages
// route GET /api/admin/packages
// @access Private
export const fetchAllPackages = asyncHandler(async (req, res) => {
  try {
    const packages = await Package.find({});
    if (!packages) {
      throw new Error("packages not found in database");
    }
    return res.status(200).json(packages);
  } catch (error) {
    res.status(404);
    throw error;
  }
});

// @desc Get active packages count for provider
// route GET /api/provider/card/active-packages
// @access Private
export const findProviderActivePackages = asyncHandler(async (req, res) => {
  const { providerId } = req;
  try {
    const activePackages = await Package.find({
      provider: providerId,
      isAvailable: true,
    });
    return res.status(200).json({ activeCount: activePackages.length });
  } catch (error) {
    console.log(error);
    res.status(400);
    throw error;
  }
});

// @desc Edit Package Basic Info
// route POST /api/provider/package/edit:packageId
// @access Private
export const editPackageBasicInfo = asyncHandler(async (req, res) => {
  const { providerId } = req;
  const { packageId } = req.params;
  const { packageName, adults, children, price, summary } = req.body;
  const files = req.files;
  const directoryPath = "server/public/";
  let { phoneNumbers } = req.body;
  phoneNumbers = phoneNumbers !== "" ? phoneNumbers.split(",") : [];

  try {
    const existPackageInfo = await Package.findById(packageId);
    if (files.length > 0) {
      existPackageInfo.coverImage.forEach((fileName) => {
        const filePath = directoryPath + fileName;
        fs.access(filePath, fs.constants.F_OK, (err) => {
          if (err) {
            console.log(err?.message);
          } else {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.log(err.message);
              }
            });
          }
        });
      });
    }
    if (!existPackageInfo)
      throw new Error("package id is invalid or incorrect");
    existPackageInfo.packageName =
      packageName !== "" ? packageName : existPackageInfo.packageName;
    existPackageInfo.adults =
      adults !== "" ? parseInt(adults) : existPackageInfo.adults;
    existPackageInfo.children =
      children !== "" ? parseInt(children) : existPackageInfo.children;
    existPackageInfo.phoneNumbers =
      phoneNumbers.length > 0 ? phoneNumbers : existPackageInfo.phoneNumbers;
    existPackageInfo.summary =
      summary !== "" ? summary : existPackageInfo.summary;
    existPackageInfo.price =
      price !== "" ? parseInt(price) : existPackageInfo.price;
    existPackageInfo.coverImage =
      files.length > 0
        ? files.map((file) => `images/packages/${providerId}/${file.filename}`)
        : existPackageInfo.coverImage;
    await existPackageInfo.save();

    return res.status(200).json({ message: "package info update success" });
  } catch (error) {
    console.log(error?.message);
    res.status(400);
    throw error;
  }
});

// @desc retrive package info
export function getPackage(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const item = await Package.findById(id).populate("provider", "brandName");
      if (!item) {
        reject("package not found");
      }
      resolve(item);
    } catch (error) {
      reject(error);
    }
  });
}
