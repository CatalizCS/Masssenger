import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

export const onBoardingTheme = {
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
    secondary: "#424242",
    button_primary: "#1A73E8",
    button_secondary: "#B0B0B0",
    input: "#F1F1F1",
  },
};

export const HomeTheme = {
  light_theme: {
    text: "#000",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
  },
  dark_theme: {
    text: "#fff",
    background: "#000",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
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
