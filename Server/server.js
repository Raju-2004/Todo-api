require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require('cors');
const bodyParser = require("body-parser");
app.use(express.json());
const { default: mongoose } = require("mongoose");
const port = process.env.PORT

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "Connection Error:"));
  db.once("open", () => {
    console.log("Connected to MongoDB");
  });

const UserRoutes = require('./routes/UserRoutes')
const TaskRoutes = require('./routes/TaskRoutes')
const SubTaskRoutes = require('./routes/SubTaskRoutes')

app.use('/',UserRoutes);
app.use('/task',TaskRoutes)
app.use('/',SubTaskRoutes)

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});