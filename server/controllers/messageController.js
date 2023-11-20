import asyncHandler from "express-async-handler";
import CustomerMessages from "../models/customerMessages.js";

// @desc Get Specified Customer Messages
// route GET /api/users/get/messages/:clientId
// @access Private

export const getUserMessages = asyncHandler(async (req, res) => {
  const { clientId } = req.params;
});
