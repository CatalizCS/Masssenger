import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { onBoardingTheme, ThemeType } from "@/constants/Theme";

export const useTheme = () => {
  const currentTheme = useSelector(
    (state: RootState) => state.theme.currentTheme
  );
  return {
    ...onBoardingTheme[currentTheme],
    fontFamily: "OpenSans_400Regular",
  };
};

export type Theme = ReturnType<typeof useTheme>;
