import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  theme: any;
}

const LargeButton: React.FC<ButtonProps> = ({ title, onPress, theme }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: theme.button_primary,
          width: theme.width ?? styles.button.width,
        },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color: theme.primary }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "85%",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "OpenSans_700Bold",
  },
});

export default LargeButton;
