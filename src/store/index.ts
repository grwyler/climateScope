import { combineReducers, configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { exampleReducer } from "../../redux/reducers/exampleReducer";

// Combine all the reducers into a single root reducer
const rootReducer = combineReducers({
  example: exampleReducer, // add any additional reducers here
});

// Create the Redux store using configureStore from @reduxjs/toolkit
const store = configureStore({
  reducer: rootReducer, // set the root reducer for the store
  middleware: [thunk], // add middleware to the store, in this case Redux Thunk
  devTools: true, // enable the Redux DevTools browser extension
});

// Define a type for the RootState, which is the type of the Redux store's state
export type RootState = ReturnType<typeof rootReducer>;

// Export the Redux store as the default export of this module
export default store;
