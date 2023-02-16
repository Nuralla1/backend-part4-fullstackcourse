const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const blogsRouter = require("./controllers/blogs");
const config = require("./utils/config");

const app = express();

mongoose.set("strictQuery", false);

console.log(`connecting to ${config.MONGODB_URI}`);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => console.log("connected to MONGODB"))
  .catch((err) => console.error(`Error connecting to MONGODB: ${err.message}`));

app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogsRouter);

module.exports = app;
