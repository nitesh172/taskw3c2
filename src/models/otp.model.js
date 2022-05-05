const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      max: 13,
    },
    otp: {
      type: String,
      required: false,
    },
    createdAt: {type: Date, default: Date.now, index: {expires: 300}}
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

var Otp = mongoose.model("otp", otpSchema);

module.exports = Otp
