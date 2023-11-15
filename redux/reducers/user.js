import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE } from "../constants";
// Initial state for the user
const initialState = {
  currentUser: null,
  posts: [],
};

// User reducer to handle state changes
export const user = (state = initialState, action) => {
  switch (action.type) {
    case USER_STATE_CHANGE:
      return {
        ...state,
        currentUser: action.currentUser,
      };
    case USER_POSTS_STATE_CHANGE:
      return {
        ...state,
        posts: action.posts,
      };
    default:
      return state;
  }
};
