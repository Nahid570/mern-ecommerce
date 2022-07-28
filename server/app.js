const express = require("express");
const cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const userRouter = require("./routes/userRoutes");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1", userRouter);

// handle error
app.use(notFound);
app.use(errorHandler);

module.exports = app;
