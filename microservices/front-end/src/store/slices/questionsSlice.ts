import {
  AnyAction,
  PayloadAction,
  ThunkAction,
  createSlice,
} from "@reduxjs/toolkit";
import { RootState } from "..";
import { Question } from "../../components/types";

const initialState: Question[] = [];

export const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    _setQuestions: (state, action: PayloadAction<Question[]>) => action.payload,
  },
});

const { _setQuestions } = questionsSlice.actions;

export function fetchQuestions(): ThunkAction<
  Promise<void>,
  RootState,
  unknown,
  AnyAction
> {
  return async function thunk(dispatch, getState) {
    const res = await fetch("/api/questions");
    const questions: Question[] = await res.json();
    dispatch(_setQuestions(questions));
  };
}

export default questionsSlice.reducer;
