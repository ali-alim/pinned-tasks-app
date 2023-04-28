const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
    },
    budget: {
      type: String,
    },
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref:'Comment'
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Topic", TopicSchema);
