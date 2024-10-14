import Layout from "@/src/contexts/Layout";
import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

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

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
    fontFamily: "OpenSans_400Regular",
  },
  label: {
    color: "#000000",
    fontSize: 14,
    marginBottom: 8,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: "#BABABA",
    borderRadius: 8,
    height: 48,
    display: "flex",
    alignItems: "center",
    paddingLeft: Layout.window.width * 0.05,
  },
  input: {
    color: "#FFFFFF",
    fontSize: 16,
    backgroundColor: "transparent",
    flex: 1,
  },
  caption: {
    color: "#BABABA",
    fontSize: 12,
    marginTop: 4,
  },
});

export default InputField;
