import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "@/slices/slice"

export const store = configureStore({
  reducer: {
    counter: counterSlice
  },
});
