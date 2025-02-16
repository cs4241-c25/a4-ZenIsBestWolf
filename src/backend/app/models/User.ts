import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  id: Schema.ObjectId,
  name: String,
  email: String,
  username: String,
  password: String,
});

export const User = model("User", UserSchema);
