import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoute from "./routes/UserRoute.js";
import blogRoute from "./routes/BlogRoute.js";

const app = express();
const url = process.env.MONGO_URL;
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected"))
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/users", userRoute);
app.use("/blog", blogRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
