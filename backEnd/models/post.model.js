import mongoose from "mongoose";

//create a schema for posts

const postSchema = new mongoose.Schema({
  profile_pic: { type: String, required: true },
  post: { type: String, required: true },
  description: { type: String, required: true },
  username: { type: String, required: true },
  userid: { type: String, required: true }
});

export default mongoose.model.Posts || mongoose.model("Posts", postSchema);


