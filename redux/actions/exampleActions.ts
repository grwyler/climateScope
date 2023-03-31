import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "../types";
import { ActionTypes } from "../types/ActionTypes";

export const incrementCount = () => ({
  type: ActionTypes.INCREMENT_COUNT,
});

export const decrementCount = () => ({
  type: ActionTypes.DECREMENT_COUNT,
});

export const asyncAction =
  () => async (dispatch: ThunkDispatch<AppState, void, AnyAction>) => {
    // Make an async call here and dispatch actions as needed
  };
