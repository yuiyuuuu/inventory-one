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
        const user = await makeGetRequest(`auth/getlocaldata/${token}`);

        dispatch(dispatchSetAuth(user));
        return user;
      } else {
        dispatch(dispatchSetAuth({ loading: "false" })); //string form false
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function authenticate(obj) {
  return async (dispatch) => {
    try {
      const data = await makePostRequest("/auth/login", obj);

      //no user = wrong pass or email not found
      if (!data.user) {
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

      if (data === "email-exists") {
        return data;
      }

      window.localStorage.setItem("token", data.jwt);
      dispatch(dispatchSetAuth(data.user));

      return data.user;
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

export default function (state = { loading: true }, action) {
  switch (action.type) {
    case SET_AUTH:
      return action.auth;
    default:
      return state;
  }
}
