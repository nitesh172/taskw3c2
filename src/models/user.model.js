const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')
require('dotenv').config()

var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    coin: {
      type: Number,
      required: false,
      default: 100,
    },
    subsription: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.methods.generateJWT = function () {
    const token = jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        coin: this.coin,
        subsription: this.subsription
    }, process.env.JWT_SECRET_KEY)
}

var User = mongoose.model("user", userSchema);

module.exports = User