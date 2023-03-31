import { AnyAction } from "redux";
import { ActionTypes } from "../types/ActionTypes";

export interface ExampleState {
  count: number;
}

const initialState: ExampleState = {
  count: 0,
};

export const exampleReducer = (
  state: ExampleState = initialState,
  action: AnyAction
): ExampleState => {
  switch (action.type) {
    case ActionTypes.INCREMENT_COUNT:
      return { ...state, count: state.count + 1 };
    case ActionTypes.DECREMENT_COUNT:
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
};
