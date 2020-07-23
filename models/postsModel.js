const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  body: {
    type: String,
    required: true,
  },
  images: {
    type: String,
  },
  comments: [
    {
      body: String,
      date: Date,
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    },
  ],
  meta: {
    likes: Number,
    dislikes: Number,
  },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
