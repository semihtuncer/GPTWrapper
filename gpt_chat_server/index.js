const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

require("dotenv").config();
const app = express();

const authRoute = require("./routes/auth");
const chatRoute = require("./routes/chat");
const messageRoute = require("./routes/message");
const promptRoute = require("./routes/prompt");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("database connection successful"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/chat", chatRoute);
app.use("/api/msg", messageRoute);
app.use("/api/prompt", promptRoute);

app.listen(5000, () => {
  console.log("server is running");
});
