import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  title: String,
  category: String,
  complexity: String,
  description: String
})

export const QuestionModel = mongoose.model('Question', QuestionSchema);
