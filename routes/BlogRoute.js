import express from "express";
import { ObjectId } from "mongodb";
import BlogDB from "../model/Blog.js";
import { authUser } from "../middlewares/authUser.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const blogs = await BlogDB.find();
    res.status(200).send(blogs);
  } catch (error) {
    res.status(500).send("Please try again later");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await BlogDB.findOne({ _id: id });
    if (blog) {
      return res.status(200).send(blog);
    } else {
      throw err;
    }
  } catch (error) {
    res.status(500).send("Please try again later");
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await BlogDB.aggregate([
      [
        {
          $search: {
            index: "blogsByUser",
            text: {
              query: id,
              path: {
                wildcard: "*",
              },
            },
          },
        },
      ],
    ])
      .exec()
      .then((response) => res.status(200).send(response))
      .catch((err) => res.status(500).send(err));
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post("/", authUser, async (req, res) => {
  try {
    const { title, content, imageURL, user } = req.body;
    const blogData = new BlogDB({
      title,
      content,
      imageURL,
      user,
    });
    const response = await blogData.save();

    res.status(201).send(response);
  } catch (error) {
    res.status(500).send("Please try again later");
  }
});

router.delete("/:id", authUser, async (req, res) => {
  try {
    const { id } = req.params;
    const response = await BlogDB.findByIdAndDelete({ _id: id });
    if (response) {
      res.status(200).send("Blog Deleted successfully");
    } else {
      throw err;
    }
  } catch (error) {
    res.status(500).send("Please try again later");
  }
});

router.patch("/:id", authUser, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const response = await BlogDB.findByIdAndUpdate({ _id: id }, data);
    if (response) {
      res.status(200).send("Blog Updated successfully");
    } else {
      throw err;
    }
  } catch (error) {
    res.status(500).send("Please try again later");
  }
});

export default router;
