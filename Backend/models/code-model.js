const mongoose = require("mongoose");
const shortID = require("shortid");

const CodeModelSchema = mongoose.Schema({
  // id:{
  //   type: String,
  //   default : shortID()
  // },
  Language: {
    type: String,
    required: true,
    enum: ["cpp", "py"],
  },
  filePath: {
    type: String,
    required: true,
  },
  codeSnippet:{
    type: String
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  startedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "success", "error"],
  },
  output: {
    type: String,
  }
});

module.exports = mongoose.model("codeModel", CodeModelSchema);