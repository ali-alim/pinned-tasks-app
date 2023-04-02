const mongoose = require("mongoose");

const PinSchema = new mongoose.Schema(
  {
    user: {
      type: String,
    },
    title: {
      type: String,
      required: true,
      min: 3,
      max: 60,
    },
    desc: {
      type: String,
      required: true,
      min: 3,
    },
    time: {
      type: Date,
      required: true,
    },
    completed: {
      type: Boolean,
    },
    category: {
      type: String,
    },
    long: {
      type: Number,
    },
    lat: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pin", PinSchema);
