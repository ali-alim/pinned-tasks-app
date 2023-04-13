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
    comments: [{
      body: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now()
      },
      user: {
        type: String,
      },

    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Topic", TopicSchema);
