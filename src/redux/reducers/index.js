// src/reducers/index.js
import { combineReducers } from "redux";
import timeListSlice from "./timeListSlice";

export default combineReducers({
  time: timeListSlice,
});
