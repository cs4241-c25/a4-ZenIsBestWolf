import { Schema, model } from "mongoose";

const DataEntrySchema = new Schema({
  id: Schema.ObjectId,
  name: String,
  email: String,
  location: String,
  start: Date,
  end: Date,
});

export const DataEntry = model("DataEntry", DataEntrySchema);
