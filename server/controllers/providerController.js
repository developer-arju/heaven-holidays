import asyncHandler from "express-async-handler";
import Provider from "../models/providerModel.js";
import jwt from "jsonwebtoken";
import sendMail from "../utils/nodeMailer.js";
import { generateToken } from "../utils/generateToken.js";

// @desc Update Password
// route POST /api/provider/update-password
// @access Private
export const updatePassword = asyncHandler(async (req, res) => {
  const { password, id } = req.body;
  if (!password || !id) {
    res.status(400);
    throw new Error("bad request");
  }
  try {
    const provider = await Provider.findById(id);
    provider.password = password;
    const result = await provider.save();
    if (!result) throw new Error("reset password failed");
    return res.status(200).send("password updated");
  } catch (error) {
    res.status(404);
    throw error;
  }
});

// @desc Verify Reset Link
// route GET /api/provider/reset/:id/:token
// @access Public
export const verifyResetLink = asyncHandler(async (req, res) => {
  const { id, token } = req.params;
  if (!id || !token) {
    res.status(400);
    throw new Error("Bad request");
  }
  try {
    const provider = await Provider.findById(id);
    if (provider) {
      const secret = process.env.JWT_SECRET + provider.password;
      const payload = jwt.verify(token, secret);
      if (!payload) throw new Error("invalid token");
      return res.status(200).json(payload);
    }
    throw new Error("looking id not found");
  } catch (error) {
    res.status(404);
    throw error;
  }
});

// @desc Verify Provider And send Unique reset link
// route POST /api/provider/reset
// @access Public
export const sendResetLink = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error("bad request");
  }

  try {
    const provider = await Provider.findOne({ email });
    if (provider && provider.blocked)
      throw new Error("your account has been blocked contact admin");
    if (provider) {
      const secret = process.env.JWT_SECRET + provider.password;
      const payload = {
        id: provider._id,
        email: provider.email,
      };
      const token = jwt.sign(payload, secret, { expiresIn: "10m" });
      const url = `http://localhost:3000/provider/reset/${provider._id}?token=${token}`;
      const mailOptions = {
        from: "Heaven Holidays <heavenholidays@heaven-holidays.iam.gserviceaccount.com>",
        to: `${email}`,
        subject: "Reset Password",
        text: `Reset Your Provider Account Password\n follow this link ${url}`,
        html: `<h2>Reset provider account password</h2><a style="padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 4px;" href=${url} target="_blank">Click here</a>`,
      };

      const result = await sendMail(mailOptions);
      if (!result) throw new Error("Error send url");
      return res.status(200).send("password rest link send to your email");
    }
    throw new Error(`${email} is not registered with us`);
  } catch (error) {
    console.log(error);
    res.status(404);
    throw error;
  }
});

// @desc Register provider account
// route POST /api/provider
// @access Public
export const registerProvider = asyncHandler(async (req, res) => {
  const { email, name, password, mobile, surname } = req.body;
  if (!email || !password || !name || !mobile) {
    res.status(400);
    throw new Error("Bad Request");
  }
  const exist = await Provider.findOne({ email });
  if (exist) {
    res.status(404);
    throw new Error("email already registered");
  }
  const provider = await Provider.create({
    email,
    name,
    password,
    mobile,
    surname: surname ? surname : "",
  });
  if (provider) {
    return res.status(201).json({
      _id: provider._id,
      email: provider.email,
      name: provider.name,
    });
  } else {
    res.status(404);
    throw new Error("user registration failed");
  }
});

// @desc Register bussiness Info
// route POST /api/provider/bussiness
// @access Public
export const registerBussiness = asyncHandler(async (req, res) => {
  const brandLogo = req.file;
  const { brandName, gst, bussinessEmail, bussinessPhone, id } = req.body;
  if (!brandName || !bussinessEmail || !bussinessPhone) {
    res.status(400);
    throw new Error("bad request");
  }
  try {
    const provider = await Provider.findById(id);
    if (
      provider &&
      !provider.brandName &&
      !provider.bussinessEmail &&
      !provider.bussinessPhone
    ) {
      await Provider.updateOne(
        { _id: id },
        {
          $set: {
            brandLogo: brandLogo ? brandLogo.filename : "",
            brandName,
            gst: gst ? gst : "",
            bussinessEmail,
            bussinessPhone,
          },
        }
      ).then((result) => {
        if (result.acknowledged) {
          res.status(200).json(result);
        }
      });
    } else {
      throw new Error("error on register bussiness info");
    }
  } catch (error) {
    res.status(404);
    throw error;
  }
});

// @desc Grant token and auth provider
// route POST /api/provider/auth
// @access Public
export const authProvider = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Bad Request");
  }
  const provider = await Provider.findOne({ email });
  if (!provider) {
    res.status(404);
    throw new Error("not registered with us");
  }
  if (provider.registrationStatus === "pending") {
    res.status(401);
    throw new Error("you are not verified yet");
  }
  if (provider.registrationStatus === "rejected") {
    res.status(401);
    throw new Errorl(
      "your registration request is rejected, contact admin for more details"
    );
  }
  if (
    provider &&
    !provider.blocked &&
    (await provider.matchPassword(password))
  ) {
    const payload = {
      id: provider._id,
      role: process.env.PROVIDER_CONST,
    };
    const token = generateToken(payload);
    const {
      blocked,
      password,
      createdAt,
      updatedAt,
      mobile,
      ...sanitizedProvider
    } = provider._doc;
    return res.status(201).json({ ...sanitizedProvider, token: token });
  }
  res.status(401);
  throw new Error("password does not match");
});

// @desc Get all documents
// route GET /api/admin/providers
// @access Private
export const getAllProviders = asyncHandler(async (req, res) => {
  try {
    const providers = await Provider.find().select("-password");
    if (!providers) throw new Error("Providers not found");
    return res.status(200).json(providers);
  } catch (error) {
    res.status(400);
    throw error;
  }
});

// @desc Toggle Provider Status
// route PUT /api/admin/providers/status-toggle
// @access Private
export const toggleProviderStatus = asyncHandler(async (req, res) => {
  const { providerId } = req.body;
  try {
    const provider = await Provider.findById(providerId).select("-password");
    if (!provider) throw new Error("provider not found");
    provider.blocked = !provider.blocked;
    const saved = await provider.save();
    console.log(saved);
    return res.status(200).json(saved);
  } catch (error) {
    res.status(400);
    throw error;
  }
});

// @desc Get pending Provider Requests
// route GET /api/admin/provider/pending-requests
// @access private
export const getPendingRequests = asyncHandler(async (req, res) => {
  try {
    const pending = await Provider.find({
      registrationStatus: "pending",
    }).select("-password");
    if (pending.length < 1) throw new Error("pending requests not found");
    return res.status(200).json(pending);
  } catch (error) {
    res.status(400);
    throw error;
  }
});

// @desc change registration status
// route PUT /api/admin/provider/change
// @access Private
export const changeRegistrationStatus = asyncHandler(async (req, res) => {
  const { id, status } = req.body;
  try {
    const provider = await Provider.findById(id);
    if (!provider) throw new Error("document not found");

    provider.registrationStatus = status;
    const saved = await provider.save();
    if (!saved) throw new Error("database operation failed");
    return res
      .status(200)
      .json({ message: `provider registration status changed to ${status}` });
  } catch (error) {
    res.status(400);
    throw error;
  }
});

// @desc Find all active providers count for admin dashboard
// route GET /api/admin/card/provider-count
// @access Private
export const findActiveProviderCount = asyncHandler(async (req, res) => {
  try {
    const providerCount = await Provider.aggregate([
      { $match: { blocked: false } },
      { $count: "providerCount" },
    ]);
    return res.status(200).json(providerCount[0]);
  } catch (error) {
    console.log(error);
    res.status(400);
    throw error;
  }
});
