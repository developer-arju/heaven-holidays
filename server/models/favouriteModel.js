import { Schema, model } from "mongoose";

const favouriteSchema = Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  packages: [{ type: Schema.Types.ObjectId, ref: "Package" }],
  properties: [{ type: Schema.Types.ObjectId, ref: "Property" }],
});

const Favourite = model("Favourite", favouriteSchema);
export default Favourite;
