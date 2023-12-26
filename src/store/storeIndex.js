import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import sidebarState from "./sidebar";
import screenWidth from "./global/screenWidth";
import datePicker from "./datePicker";
import allStores from "./allStores";
import loading from "./global/loading";
import auth from "./auth/auth";
import carTrackers from "./cartrackers/cars";

const reducer = combineReducers({
  sidebarState,
  screenWidth,
  datePicker,
  allStores,
  loading,
  auth,
  carTrackers,
});

let middleware = "";

if (process.env.NODE_ENV === "development") {
  middleware = composeWithDevTools(applyMiddleware(thunkMiddleware));
} else {
  middleware = composeWithDevTools(applyMiddleware(thunkMiddleware));
}

const store = createStore(reducer, middleware);

export default store;
