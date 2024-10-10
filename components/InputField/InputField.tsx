import React, { useState } from "react";
import { View, TextInput, Text } from "react-native";
import { styles } from "./styles";

interface InputFieldProps {
  label: string;
  placeholder: string;
  onTextChange: (text: string) => void;
  secureTextEntry?: string;
  theme?: any;
  caption?: string;
  hasError?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  onTextChange,
  secureTextEntry,
  theme,
  caption,
  hasError,
}) => {
  const [value, setValue] = useState("");

  return (
    <View style={styles.container}>
      <Text style={[styles.label, theme && { color: theme.textColor }]}>
        {label}
      </Text>
      <View
        style={[
          styles.inputWrapper,
          hasError && { borderColor: "#FF0000" },
          theme && { borderColor: theme.borderColor },
        ]}
      >
        <TextInput
          style={[styles.input, theme && { color: theme.textColor }]}
          placeholder={placeholder}
          textAlignVertical="center"
          placeholderTextColor={theme ? theme.placeholderTextColor : "#BABABA"}
          value={value}
          secureTextEntry={secureTextEntry ? true : false}
          onChangeText={(text) => {
            setValue(text);
            onTextChange(text);
          }}
        />
      </View>
      {caption && (
        <Text style={[styles.caption, theme && { color: theme.captionColor }]}>
          {caption}
        </Text>
      )}
    </View>
  );
};

export default InputField;
