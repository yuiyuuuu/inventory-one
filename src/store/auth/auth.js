const SET_AUTH = "SET_AUTH";

import {
  makePostRequest,
  makeGetRequest,
} from "../../requests/helperFunctions";

export const dispatchSetAuth = (auth) => ({
  type: SET_AUTH,
  auth,
});

export function getLocalData() {
  const token = window.localStorage.getItem("token");

  return async (dispatch) => {
    try {
      if (token && token !== "undefined") {
        const user = await makeGetRequest("auth/getlocaldata", {
          headers: {
            authorization: token,
          },
        });

        dispatch(dispatchSetAuth(user));
        return user;
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function authenticate(obj) {
  return async (dispatchh) => {
    try {
      const data = await makePostRequest("/auth/login", obj);

      if (data === "wrongpassword" || data === "notfound") {
        return data;
      }

      window.localStorage.setItem("token", data.jwt);
      dispatch(dispatchSetAuth(data.user));
      return "successful";
    } catch (error) {
      console.log(error);
    }
  };
}

export function signup(obj) {
  return async (dispatch) => {
    try {
      const data = await makePostRequest("auth/signup", obj);

      if (data === "duplicate") {
        return data;
      }

      window.localStorage.setItem("token", data.jwt);
      dispatch(dispatchSetAuth(data.user));
      return "successful";
    } catch (error) {
      console.log(error);
    }
  };
}

export function logout() {
  return (dispatch) => {
    window.localStorage.removeItem("token");
    dispatch(dispatchSetAuth({}));
  };
}

export default function (state = {}, action) {
  switch (action.type) {
    case SET_AUTH:
      return action.auth;
    default:
      return state;
  }
}
