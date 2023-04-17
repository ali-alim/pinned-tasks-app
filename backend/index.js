const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/users");
const pinRoute = require("./routes/pins");
const topicRoute = require("./routes/topics");
const archiveRoute = require("./routes/archives");
const commentRoute = require("./routes/comments");
const categoryRoute = require("./routes/categories");
const cors = require("cors");

dotenv.config();

app.use(cors());

app.use(express.json());

mongoose 
 .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,   })   
 .then(() => console.log("MongoDB connected!"))
 .catch(err => console.log(err));

app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);
app.use("/api/topics", topicRoute);
app.use("/api/archives", archiveRoute);
app.use("/api/comments", commentRoute);
app.use("/api/categories", categoryRoute);

app.listen(process.env.PORT, () => {
  console.log("Backend server is running!");
});
