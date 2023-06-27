import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import sidebarState from "./sidebar";
import screenWidth from "./global/screenWidth";
import datePicker from "./datePicker";
import allStores from "./allStores";

const reducer = combineReducers({
  sidebarState,
  screenWidth,
  datePicker,
  allStores,
});

let middleware = "";

if (process.env.NODE_ENV === "development") {
  middleware = composeWithDevTools(applyMiddleware(thunkMiddleware));
} else {
  middleware = composeWithDevTools(applyMiddleware(thunkMiddleware));
}

const store = createStore(reducer, middleware);

export default store;
