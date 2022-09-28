import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: String,
  content: String,
  imageURL: String,
  created_at: {
    type: Date,
    default: Date.now(),
  },
  user: Object,
});

export default mongoose.model("Blogs", BlogSchema);
