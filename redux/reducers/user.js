// Initial state for the user
const initialState = {
  currentUser: null,
};

// User reducer to handle state changes
export const user = (state = initialState, action) => {
  return {
    ...state,
    currentUser: action.currentUser,
  };
};
