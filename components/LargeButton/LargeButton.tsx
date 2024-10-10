import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";

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

export default LargeButton;
