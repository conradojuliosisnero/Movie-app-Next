import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: [],
};

export const searchMovies = createSlice({
  name: "filterMovie",
  initialState,
  reducers: {
    setSearchMovie: (state,action) => {
      state.Movies = state.payload;
    },
  },
});

export const { searchMovie } = searchMovies.actions;

export default searchMovies.reducer;
