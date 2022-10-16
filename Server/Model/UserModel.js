/** @format */

const mongoose = require("mongoose");
const UserSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, trim: true, require: true },
    username: { type: String, trim: true, require: true, unique: true },
    email: { type: String, trim: true, require: true, unique: true },
    password: { type: String, trim: true, require: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
