import { Schema, Model } from "mongoose";

const messageSchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    unique: true,
    ref: "User",
    required: true,
  },
  messages: [
    {
      sender: { type: String, required: true },
      text: { type: String },
      timestamp: true,
    },
  ],
});

const CustomerMessages = Model("CustomerMessages", messageSchema);
export default CustomerMessages;
