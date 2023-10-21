import {
  AnyAction,
  PayloadAction,
  ThunkAction,
  createSlice,
} from "@reduxjs/toolkit";
import { RootState } from "..";
import { HistoryItem } from "../../components/types";

const initialState: HistoryItem[] = [];

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    _setHistoryItems: (state, action: PayloadAction<HistoryItem[]>) =>
      action.payload,
  },
});

const { _setHistoryItems } = historySlice.actions;

export function fetchHistory(username:string): ThunkAction<
  Promise<void>,
  RootState,
  unknown,
  AnyAction
> {
  return async function thunk(dispatch, getState) {
    const res = await fetch(`/api/history/${username}`);
    const historyItems: HistoryItem[] = await res.json();
    dispatch(_setHistoryItems(historyItems));
  };
}

export default historySlice.reducer;
