import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

interface ButtonProps {
  title: string;
  type: "large" | "medium" | "small";
  onPress: () => void;
  theme: any;
}

const Button: React.FC<ButtonProps> = ({ title, type, onPress, theme }) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles[type], { ...theme }]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color: theme.text }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 20,
    marginBottom: 30,
  },
  large: {
    width: "100%",
  },
  medium: {
    width: "50%",
  },
  small: {
    width: "30%",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "OpenSans_700Bold",
  },
});

export default Button;
