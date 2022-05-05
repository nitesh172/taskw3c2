const express = require("express");

const app = express();
const cors = require("cors")

const userRouter = require('./Routers/user.router')

app.use(express.json());

app.use(cors())

app.use("/auth", userRouter);

module.exports = app;
