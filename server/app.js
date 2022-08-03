const express = require("express");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoutes");
const errorMiddleware = require("./middlewares/error");
const productRouter = require("./routes/productRoutes");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1", userRouter);
app.use("/api/v1", productRouter);

// handle error
app.use(errorMiddleware);

module.exports = app;
