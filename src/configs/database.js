const mongoose = require("mongoose");
require('dotenv').config()

const Connection = () => {
  return mongoose.connect(process.env.mongodb, { useNewUrlParser: true }).then(() => {
    console.log("Connected Database");
  });
};

module.exports = Connection;
