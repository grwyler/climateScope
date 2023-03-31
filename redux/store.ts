import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createWrapper } from "next-redux-wrapper";
import thunkMiddleware from "redux-thunk";

interface AppState {
  // Define your initial state here
}

const initialState: AppState = {
  // Initialize your state here
};
