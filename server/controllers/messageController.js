import asyncHandler from "express-async-handler";
import CustomerMessages from "../models/customerMessages.js";

// @desc Save user messages
export const saveUserMessage = async ({ clientId, message }) => {
  try {
    const exist = await CustomerMessages.findOne({ clientId });
    if (exist) {
      exist.messages = [...exist.messages, { sender: "client", text: message }];
      return await exist.save();
    } else {
      const newMessageModal = await CustomerMessages.create({
        clientId,
        messages: [{ sender: "client", text: message }],
      });

      return newMessageModal;
    }
  } catch (error) {
    console.log(error?.message || error);
    return false;
  }
};

// @desc Save Admin reply messages
export const replyToClient = async (chatId, text) => {
  try {
    const chat = await CustomerMessages.findById(chatId);
    if (chat) {
      chat.messages = [...chat.messages, { sender: "admin", text: text }];
      return await chat.save();
    }
  } catch (error) {
    console.log(error.message);
    return error;
  }
};

// @desc Load Messages
// route GET /api/users/messages
// @private
export const loadClientMessages = asyncHandler(async (req, res) => {
  const { userId } = req;
  try {
    const chats = await CustomerMessages.findOne({ clientId: userId });
    if (!chats) throw new Error("No records found");
    if (chats.messages.length < 1) throw new Error("Messages not found");

    return res.status(200).json(chats.messages);
  } catch (error) {
    res.status(400);
    throw error;
  }
});

// @desc Load Chat List Admin
// route GET /api/admin/messages
// @access Private
export const loadChatLists = asyncHandler(async (req, res) => {
  try {
    const chats = await CustomerMessages.find({}).populate({
      path: "clientId",
      select: "-password",
    });
    if (chats.length < 1) throw new Error("No chats found");

    return res.status(200).json(chats);
  } catch (error) {
    res.status(400);
    throw error;
  }
});
