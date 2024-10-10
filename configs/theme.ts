import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const theme = {
  dark_theme: {
    background: "#121212",
    primary: "#FFFFFF",
    secondary: "#B0B0B0",
    button_primary: "#1A73E8",
    button_secondary: "#B0B0B0",
    input: "#2C2C2C",
  },
  light_theme: {
    background: "#FFFFFF",
    primary: "#000000",
    secondary: "#B0B0B0",
    button_primary: "#1A73E8",
    button_secondary: "#B0B0B0",
    input: "#F1F1F1",
  },
};

export type ThemeType = "light_theme" | "dark_theme";

interface ThemeState {
  currentTheme: ThemeType;
}

const initialState: ThemeState = {
  currentTheme: "light_theme",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.currentTheme =
        state.currentTheme === "light_theme" ? "dark_theme" : "light_theme";
    },
    setTheme: (state, action: PayloadAction<ThemeType>) => {
      state.currentTheme = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
