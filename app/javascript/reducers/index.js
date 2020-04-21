import { combineReducers } from "redux";

import { thingsReducer } from "./things";
import { userReducer } from "./userReducer";
export default combineReducers({
  userReducer: userReducer
});
