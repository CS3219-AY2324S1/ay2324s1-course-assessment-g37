import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  title: String,
  categories: [String],
  complexity: String,
  description: String
})

export const QuestionModel = mongoose.model('Question', QuestionSchema);
