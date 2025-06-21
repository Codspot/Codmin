import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentScreen: "projects",
  currentProjectStep: 1, // 1: Basic, 2: Media, 3: Description, 4: Settings
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setCurrentScreen: (state, action) => {
      state.currentScreen = action.payload;
    },
    setCurrentProjectStep: (state, action) => {
      state.currentProjectStep = action.payload;
    },
  },
});

export const { setCurrentScreen, setCurrentProjectStep } = uiSlice.actions;
export default uiSlice.reducer;
