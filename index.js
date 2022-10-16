/** @format */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const database = require("./database");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
// app.use(logger("dev"));

// *** User routes
app.use("/api/user", require("./Server/Routes/userRoutes"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on ${port}`));
module.exports = app;
