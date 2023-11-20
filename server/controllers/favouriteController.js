import Favourite from "../models/favouriteModel.js";
import asyncHandler from "express-async-handler";

// @desc Save packages to favourite list
// route POST /api/users/packages/save
// @access Private
export const addFavouritePackage = asyncHandler(async (req, res) => {
  const { userId } = req;
  const { packageId } = req.body;
  try {
    if (!userId || !packageId) throw new Error("parameters not match criteria");
    const saved = await Favourite.findOne({ userId });
    if (!saved) {
      const newList = await Favourite.create({
        userId,
        packages: [packageId],
      });
      if (newList) {
        return res.status(200).json({ message: "package added to favourites" });
      } else {
        throw new Error("db operation failed");
      }
    }
    if (saved.packages.includes(packageId)) {
      return res
        .status(200)
        .json({ message: "pakage already exist in favourites" });
    } else {
      saved.packages = [...saved.packages, packageId];
    }
    const result = await saved.save();
    if (!result) throw new Error("db operation failed");
    return res.status(200).json({ message: "package added to favourites" });
  } catch (error) {
    res.status(400);
    throw error;
  }
});

// @desc Get all favourite packages of single user
// route GET /api/users/favourites/packages
// @access Private
export const findAllFavouritePackages = asyncHandler(async (req, res) => {
  const { userId } = req;
  try {
    const savedPackages = await Favourite.findOne({ userId }).populate({
      path: "packages",
      populate: {
        path: "provider",
        select: "brandName -_id",
      },
    });
    if (!savedPackages) throw new Error("nothing on favourites");
    if (savedPackages.packages) {
      return res.status(200).json(savedPackages.packages);
    }
    throw new Error("favourite packages not found");
  } catch (error) {
    res.status(400);
    throw error;
  }
});

// @desc Remove package from favourites
// route PUT /api/users/favourites/remove
// @access Private
export const removeFavPackage = asyncHandler(async (req, res) => {
  const { userId } = req;
  const { packageId } = req.body;
  try {
    if (!packageId) throw new Error("Invalid body parameters");
    const favouriteList = await Favourite.findOne({ userId });
    if (!favouriteList) throw new Error("You dont have favourite list");
    favouriteList.packages = favouriteList.packages.filter(
      (id) => id.toString() !== packageId
    );
    const savedList = await favouriteList.save();
    if (!savedList) throw new Error("db operation failed");
    return res.status(200).json(savedList);
  } catch (error) {
    res.status(400);
    throw error;
  }
});
