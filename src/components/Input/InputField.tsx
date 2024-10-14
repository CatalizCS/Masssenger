import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";

export type InputFieldProps = {
  label: string;
  icon: JSX.Element;
  inputType: "text" | "password";
  keyboardType: "default" | "email-address" | "numeric" | "phone-pad";
  fieldButtonLabel?: string;
  fieldButtonFunction: () => void;
  onTextChange?: (text: string) => void;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  inputType,
  keyboardType,
  fieldButtonLabel,
  fieldButtonFunction,
  onTextChange,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        paddingBottom: 8,
        marginBottom: 25,
      }}
    >
      {icon}
      {inputType == "password" ? (
        <TextInput
          placeholder={label}
          keyboardType={keyboardType}
          style={{ flex: 1, paddingVertical: 0 }}
          secureTextEntry={true}
          onChange={(e) => onTextChange && onTextChange(e.nativeEvent.text)}
        />
      ) : (
        <TextInput
          placeholder={label}
          keyboardType={keyboardType}
          style={{ flex: 1, paddingVertical: 0 }}
          onChange={(e) => onTextChange && onTextChange(e.nativeEvent.text)}
        />
      )}
      {fieldButtonLabel && (
        <TouchableOpacity onPress={fieldButtonFunction}>
          <Text style={{ color: "#1A73E8", fontFamily: "OpenSans_700Bold" }}>
            {fieldButtonLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InputField;
