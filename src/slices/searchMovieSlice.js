import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: [],
};

export const searchMovieSlice = createSlice({
  name: "searchMovie",
  initialState,
  reducers: {
    searchMovie: (state, action) => {
      state.search = action.payload;
    },
  },
});

export const { searchMovie } = searchMovieSlice.actions;

export default searchMovieSlice.reducer;
