import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentScreen: "projects",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setCurrentScreen: (state, action) => {
      state.currentScreen = action.payload;
    },
  },
});

export const { setCurrentScreen } = uiSlice.actions;
export default uiSlice.reducer;
