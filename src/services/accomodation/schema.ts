import mongoose from "mongoose";

const { Schema, model } = mongoose;
const accomodationSchema = new Schema<IAccomodation>(
  {
    name: { type: String, required: true },
    maxGuests: { type: Number, required: true },
    description: { type: String, required: true },
    city: { type: String, required: true },
    host: { type: Schema.Types.ObjectId, ref: "Users" },
  },
  {
    timestamps: true,
  }
);
export default model("accomodation", accomodationSchema);
