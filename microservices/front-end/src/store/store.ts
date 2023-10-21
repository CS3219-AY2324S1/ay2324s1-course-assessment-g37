import { configureStore } from "@reduxjs/toolkit";
import successSnackbarReducer from "./slices/successSnackbarSlice";
import questionsReducer from "./slices/questionsSlice";
import historyReducer from "./slices/historySlice";

export const store = configureStore({
  reducer: {
    successSnackbar: successSnackbarReducer,
    questions: questionsReducer,
    history: historyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
