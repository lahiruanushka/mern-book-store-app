import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import wishlistReducer from "../features/wishlistSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  wishlist: wishlistReducer,
});

export default rootReducer;
