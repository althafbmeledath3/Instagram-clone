import mongoose from "mongoose";

//create a schema for posts

const postSchema = new mongoose.Schema({
  post: { type: String, required: true },
  description: { type: String, required: true }
});

export default mongoose.model.Posts || mongoose.model("Posts", postSchema);


