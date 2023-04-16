const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic'
    },
    completed: {
      type: Boolean
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
