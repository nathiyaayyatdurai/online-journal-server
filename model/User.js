import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User name is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email Id is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  profilePicture: {
    type: String,
  },
  token: {
    type: String,
  },
});

export default mongoose.model("Users", UserSchema);
