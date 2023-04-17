const mongoose = require("mongoose");

// Create a schema for the inputs array
const inputSchema = new mongoose.Schema({
  content: String,
  date: {type: Date, default: Date.now},
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId,
  },
});

// Create a schema for the Archive model
const archiveSchema = new mongoose.Schema(
  {
    name: String,
    inputs: [inputSchema],
    createdBy: String
  },
  { timestamps: true }
);

// Create the Archive model
module.exports = mongoose.model("Archive", archiveSchema);
