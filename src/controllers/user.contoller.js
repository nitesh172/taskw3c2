const bcrypt = require("bcrypt");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const otpGenerator = require("otp-generator");
const emailCode = require("../configs/emailCode");
const transporter = require("../configs/email");

const User = require("../models/user.model");
const Otp = require("../models/otp.model");

const newToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET_KEY);
};

const create = async (req, res) => {
  try {
    const user = await Otp.findOne({
      email: req.body.email,
    });

    const OTP = otpGenerator.generate(6, {
      digits: true,
      specialChars: false,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
    });

    const mailOptions = {
      from: process.env.user, // sender address
      to: req.body.email, // list of receivers
      subject: "OTP Login", // Subject line
      html: `${emailCode(OTP)}`, // plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) console.log(err);
      else console.log(info);
    });

    const salt = await bcrypt.genSalt(16);
    let result;
    let otp;

    if (user) {
      user.otp = OTP;
      user.otp = await bcrypt.hash(user.otp, salt);
      result = await user.save();
    } else {
      otp = new Otp({ email: req.body.email, otp: OTP });
      otp.otp = await bcrypt.hash(otp.otp, salt);
      result = await otp.save();
    }

    return res.status(200).send(result);
  } catch (error) {
    console.log(error.message);
  }
};

const verifyOtp = async (req, res) => {
  const otpHolder = await Otp.find({
    email: req.body.email,
  });

  if (otpHolder.length === 0)
    return res.status(400).send({ message: "You use expire OTP!" });

  const rightOtpFind = otpHolder[otpHolder.length - 1];

  const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

  if (rightOtpFind.email === req.body.email && validUser) {
    const findUser = await User.findOne({
      email: req.body.email,
    });

    console.log(findUser);

    if (findUser) {
      const OTPDelete = await Otp.deleteMany({
        email: rightOtpFind.email,
      });

      const token = newToken(findUser);

      return res.status(201).send({
        token: token,
        data: findUser,
      });
    } else {
      const user = new User(_.pick(req.body, ["email", "name"]));

      const token = user.generateJWT();

      const result = await user.save();

      const OTPDelete = await Otp.deleteMany({
        email: rightOtpFind.email,
      });

      return res.status(201).send({
        token: token,
        data: result,
      });
    }
  } else {
    return res.status(400).send({ message: "Your OTP was Wrong!" });
  }
};

module.exports = { create, verifyOtp };
