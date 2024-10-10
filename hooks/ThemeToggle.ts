import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { theme, ThemeType } from "@/configs/theme";

export const useTheme = () => {
  const currentTheme = useSelector(
    (state: RootState) => state.theme.currentTheme
  );
  return {
    ...theme[currentTheme],
    fontFamily: "OpenSans_400Regular",
  };
};

export type Theme = ReturnType<typeof useTheme>;
