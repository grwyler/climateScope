// define action types as constants
export const SET_EXAMPLE_DATA = "SET_EXAMPLE_DATA";

// define action creators as functions that return action objects
export const setExampleData = (data: any) => ({
  type: SET_EXAMPLE_DATA,
  payload: data,
});

// export all action types and creators as a single object
export const actions = {
  SET_EXAMPLE_DATA,
  setExampleData,
};

// export the types of all actions for use in reducers and selectors
export type ExampleAction = ReturnType<typeof setExampleData>;
