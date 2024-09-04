const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./models/db");
const PORT = process.env.PORT || 8080;
const TaskRouter = require("./routes/TaskRouter");
const bodyParser = require("body-parser");
const cors = require("cors");
connectDB();

app.get("/", (req, res) => {
  res.send("Hello from the server");
});
app.use(cors());
app.use(bodyParser.json());
app.use("/tasks", TaskRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT=${PORT}`);
});
