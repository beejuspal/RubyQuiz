import axios from "axios";
import {
  USER_SIGN_UP,
  USER_LOGIN,
  SET_MESSAGE,
  USER_GET
} from "../reducers/types";
export const createUser = (courseInfo, callback) => dispatch => {
  debugger;
  axios
    .post("http://localhost:9095/users", courseInfo, { withCredentials: true })
    .then(
      resp => {
        if (resp.data.status === "created") {
          dispatch({
            type: USER_SIGN_UP,
            payload: {
              Result: resp.data
            }
          });
          callback && callback(resp.data);
          dispatch({
            type: SET_MESSAGE,
            payload: "User created successfully!"
          });
        } else {
          dispatch({
            type: SET_MESSAGE,
            payload: "Failed to create user."
          });
          callback && callback(null);
        }
      },
      err => {
        dispatch({
          type: SET_MESSAGE,
          payload: "Failed to create user."
        });
      }
    );
};
export const loginUser = (loginInfo, callback) => dispatch => {
  debugger;
  axios
    .post("http://localhost:9095/login", loginInfo, { withCredentials: true })
    .then(
      resp => {
        if (resp.data.logged_in) {
          dispatch({
            type: USER_LOGIN,
            payload: {
              Result: resp.data
            }
          });
          callback && callback(resp.data);
          dispatch({
            type: SET_MESSAGE,
            payload: "Login success!"
          });
        } else {
          dispatch({
            type: SET_MESSAGE,
            payload: "Failed to login"
          });
          callback && callback(null);
        }
      },
      err => {
        dispatch({
          type: SET_MESSAGE,
          payload: "Failed to login."
        });
      }
    );
};
export const setMessage = message => dispatch => {
  dispatch({
    type: SET_MESSAGE,
    payload: message
  });
};
export const getloginUser = callback => dispatch => {
  debugger;
  axios.get("http://localhost:9095/logged_in", { withCredentials: true }).then(
    resp => {
      if (resp.data.logged_in) {
        dispatch({
          type: USER_GET,
          payload: {
            Result: resp.data
          }
        });
        callback && callback(resp.data);
        dispatch({
          type: SET_MESSAGE,
          payload: "Login success!"
        });
      } else {
        dispatch({
          type: SET_MESSAGE,
          payload: "Failed to login"
        });
        callback && callback(null);
      }
    },
    err => {
      dispatch({
        type: SET_MESSAGE,
        payload: "Failed to login."
      });
    }
  );
};
