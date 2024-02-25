require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(express.json());
const { default: mongoose } = require("mongoose");
const port = process.env.PORT || 300;
const { priorityUpdateCron, voiceCallCron } = require("./CronLogics");

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const UserRoutes = require("./routes/UserRoutes");
const TaskRoutes = require("./routes/TaskRoutes");
const SubTaskRoutes = require("./routes/SubTaskRoutes");

app.use("/", UserRoutes);
app.use("/", TaskRoutes);
app.use("/", SubTaskRoutes);

priorityUpdateCron.start();
voiceCallCron.start();

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
