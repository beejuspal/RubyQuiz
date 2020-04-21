import { USER_SIGN_UP, USER_LOGIN, SET_MESSAGE, USER_GET } from "./types";

const initialState = {
  subjData: [],
  subDataById: [],
  totalSub: 0,
  currSub: 0,
  signUpUser: [],
  message: "",
  loginUser: [],
  userDataGet: []
};

export function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_MESSAGE:
      return {
        ...state,
        message: action.payload
      };
    case USER_SIGN_UP:
      return {
        ...state,
        signUpUser: action.payload
      };
    case USER_LOGIN:
      return {
        ...state,
        loginUser: action.payload
      };
    case USER_GET:
      return {
        ...state,
        userDataGet: action.payload
      };

    default:
      return state;
  }
}
