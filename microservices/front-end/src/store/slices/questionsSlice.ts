import {
  AnyAction,
  PayloadAction,
  ThunkAction,
  createSlice,
} from "@reduxjs/toolkit";
import { RootState } from "..";
import { Question } from "../../components/types";
import authServiceUrl from "../../utility/authServiceUrl";

const initialState: Question[] = [];

export const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    _setQuestions: (_state, action: PayloadAction<Question[]>) => action.payload,

    updateQuestionCategory: (
      state,
      action: PayloadAction<{ qustionId: string; category: string; action: "add" | "remove" }>
    ) => {
      const question = state.find(q => q._id === action.payload.qustionId);
      if (question) {
        if (action.payload.action === "add") {
          question.categories.push(action.payload.category);
        } else {
          question.categories = question.categories.filter(cat => cat !== action.payload.category);
        }
      }
    },

  },
});

export const { _setQuestions, updateQuestionCategory } = questionsSlice.actions;

export function fetchQuestions(): ThunkAction<
  Promise<Question[]>,
  RootState,
  unknown,
  AnyAction
> {
  return async function thunk(dispatch) {
    const res = await fetch(`${authServiceUrl}/api/questions`, { credentials: "include" });
    const questions: Question[] = await res.json();
    dispatch(_setQuestions(questions));
    return questions;
  };
}

export default questionsSlice.reducer;
