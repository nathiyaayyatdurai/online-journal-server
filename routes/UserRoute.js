import express from "express";
import UserDB from "../model/User.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authUser } from "../middlewares/authUser.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const user = await UserDB.findOne({ email: req.body.email });
    if (user) {
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) throw new Error("Invalid Credentials");

        if (result) {
          const token = jwt.sign({ _id: user._id }, "blogSecret", {
            expiresIn: "10h",
          });
          user.token = token;

          res.status(200).send(user);
        } else {
          res.status(404).send("Invalid Credentials");
        }
      });
    } else {
      throw err;
    }
  } catch (error) {
    res.status(404).send("Invalid Credentials");
  }
});

router.post("/auto-login", authUser, async (req, res) => {
  res.send(req.user);
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, profilePicture } = req.body;

    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) throw new Error("User already exists");
      const userData = new UserDB({
        name,
        email,
        password: hashedPassword,
        profilePicture,
      });
      const token = jwt.sign({ _id: userData._id }, "blogSecret", {
        expiresIn: "24h",
      });
      userData.token = token;
      userData
        .save()
        .then((response) => res.status(200).send(response))
        .catch((err) =>
          res.status(404).send("User already exists, Please try logging In")
        );
    });
  } catch (error) {
    res.status(404).send("User already exists, Please try logging In");
  }
});

export default router;
