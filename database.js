/** @format */

require("dotenv").config();
const mongoose = require("mongoose");

// mongoose.connect(process.env.DB_URL_DEV);
mongoose.connect(process.env.DB_URL_TEST);

mongoose.connection.on("error", () => console.log("DB is not connected"));
mongoose.connection.on("connected", () => console.log("DB is connected"));
