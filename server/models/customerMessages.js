import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
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
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CustomerMessages = model("CustomerMessages", messageSchema);
export default CustomerMessages;
