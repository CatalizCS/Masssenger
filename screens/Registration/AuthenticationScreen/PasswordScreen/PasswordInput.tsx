import LargeButton from "@/components/LargeButton/LargeButton";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/ToastMessage/Toast";
import { onBoardingTheme } from "@/constants/Theme";
import { auth } from "@/firebase/firebase.config";
import { codeToMessage } from "@/firebase/firebase.handleError";
import { useAppSelector } from "@/store/store";
import { signInWithEmailAndPassword, AuthError } from "firebase/auth";
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

interface PasswordInputProps {
  usernameString: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ usernameString }) => {
  const currentTheme =
    onBoardingTheme[useAppSelector((state) => state.theme.currentTheme)];
  const [password, setPassword] = useState("");

  async function login(passwordString: string) {
    try {
      console.log(usernameString);
      await signInWithEmailAndPassword(auth, usernameString, passwordString);

      showSuccessToast("Đăng nhập thành công");
    } catch (error) {
      const errorCode = (error as AuthError).code;
      const errorMessage = codeToMessage(errorCode);
      showErrorToast(errorMessage);
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.phoneNumberContainer}>
        <View style={styles.phoneIconContainer}>
          <View style={styles.phoneIcon} />
        </View>
        <Text style={styles.phoneNumber}>{usernameString}</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: currentTheme.primary }]}>
          Mã xác nhận
        </Text>
        <TextInput
          style={[
            styles.input,
            { color: currentTheme.primary, width: "100%", marginBottom: 5 },
          ]}
          secureTextEntry={true}
          textAlign="center"
          placeholder="Nhập mã xác nhận"
          accessibilityLabel="Enter verification code"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
          }}
        />

        <LargeButton
          title="Đăng nhập"
          onPress={() => login(password)}
          theme={{ ...currentTheme, primary: "#FFFFFF", width: "60%" }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: "100%",
  },
  phoneNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  phoneIconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  phoneIcon: {
    width: 50,
    height: 50,
    borderRadius: 20,
    borderColor: "rgba(0, 0, 0, 1)",
    borderWidth: 1,
  },
  phoneNumber: {
    color: "#BDBDBD",
    fontFamily: "OpenSans_400Regular",
    fontSize: 16,
    fontWeight: "400",
    marginLeft: 5,
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
  },
  label: {
    color: "#FFFFFF",
    alignItems: "baseline",
    fontFamily: "OpenSans_400Regular",
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 10,
  },
  input: {
    borderRadius: 15,
    borderColor: "rgba(189, 189, 189, 1)",
    borderWidth: 1,
    padding: 20,
    color: "#FFFFFF",
    fontFamily: "OpenSans_400Regular",
    fontSize: 16,
  },
});

export default PasswordInput;
