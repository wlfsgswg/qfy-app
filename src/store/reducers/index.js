import { combineReducers } from "redux";
import code from "./code.js";
import menu from "./menu.js";
import focus from "./focus.js";
const reducer = combineReducers({
  code,
  menu,
  focus,
});

export default reducer;
