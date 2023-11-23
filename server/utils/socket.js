import { verifyToken } from "./generateToken.js";
import {
  saveUserMessage,
  replyToClient,
} from "../controllers/messageController.js";

// export const onDisconnect = (socket, connectedSockets) => {

//   console.log("socket disconnected: " + socket.id);
// };

export const onGetMessage = async ({ userId, token, message }) => {
  const payload = verifyToken(token);
  if (payload && payload.id === userId) {
    const chat = await saveUserMessage({ clientId: userId, message });
    if (chat) {
      return chat;
    }
  }
  return new Error("you are not authorized to send messsages");
};

export const sendReply = async ({ text, chatId }) => {
  return await replyToClient(chatId, text);
};
