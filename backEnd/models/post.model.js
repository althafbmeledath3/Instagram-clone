import mongoose from "mongoose";

//create a schema for posts

const postSchema = new mongoose.Schema({
  profile_pic: { type: String, required: true },
  post: [{ type: String }],
  description: { type: String, required: true },
  username: { type: String, required: true },
  userid: { type: String, required: true },
  likes: [{ type: String}]
});

export default mongoose.model.Posts || mongoose.model("Posts", postSchema);


