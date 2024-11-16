import { configureStore } from "@reduxjs/toolkit";
import searchMovieSlice from "@/slices/searchMovieSlice";

export const store = configureStore({
  reducer: {
    searchMovie: searchMovieSlice, 
  },
});
