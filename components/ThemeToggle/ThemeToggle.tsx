import React from "react";
import { View, Switch, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/constants/Theme";
import { RootState } from "@/store/store";

const ThemeToggle: React.FC = () => {
  const dispatch = useDispatch();
  const currentTheme = useSelector(
    (state: RootState) => state.theme.currentTheme
  );

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <View style={styles.container}>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={currentTheme === "dark_theme" ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={handleToggle}
        value={currentTheme === "dark_theme"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
});

export default ThemeToggle;
