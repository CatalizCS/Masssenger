import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import InputField from "@/components/InputField/InputField";
import LargeButton from "@/components/LargeButton/LargeButton";
import { useNavigation } from "@react-navigation/native";
import { theme } from "@/configs/theme";
import { useAppSelector } from "@/store/store";

import { styles } from "./styles";

const LoginScreen: React.FC = () => {
  const images = [
    require("@/assets/backgrounds/46160.jpg"),
    require("@/assets/backgrounds/53594.jpg"),
    require("@/assets/backgrounds/158827.jpg"),
    require("@/assets/backgrounds/531756.jpg"),
  ];

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [randomImage, setRandomImage] = useState(images[0]);
  const [showCaption, setShowCaption] = useState(true);
  const [error, setError] = useState("Vui lòng nhập username hoặc email");

  const navigation: any = useNavigation();
  const currentTheme =
    theme[useAppSelector((state) => state.theme.currentTheme)];

  useState(() => {
    const randomIndex = Math.floor(Math.random() * images.length);
    setRandomImage(images[randomIndex]);
  });

  const checkValidUsername = (usernameString: string) => {
    if (usernameString === "") {
      setError("Vui lòng nhập username hoặc email");
      setShowCaption(true);
      setValidUsername(false);
      return;
    }

    // checking if the email format is correct
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (emailPattern.test(usernameString)) {
      setShowCaption(false);
      setValidUsername(true);
      return true;
    }

    // checking if the username format is correct
    const usernamePattern = /^[a-zA-Z0-9._-]{3,}$/;
    if (!usernamePattern.test(usernameString)) {
      setError("Tên người dùng không hợp lệ");
      setShowCaption(true);
      setValidUsername(false);
      return false;
    }

    setValidUsername(true);
    return true;
  };

  const handleLogin = async () => {
    navigation.navigate("PasswordVerify", { usernameString: username });
  };

  return (
    <>
      <StatusBar hidden={true} />
      <ImageBackground source={randomImage} style={styles.backgroundImage}>
        {/* add logo at center */}
        <View style={styles.logoContainer}>
          <Text style={{ color: "#FFFFFF", fontSize: 40 }}>Logo</Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View
            style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.2)" }]}
          >
            <View
              style={[
                styles.loginContainer,
                { backgroundColor: currentTheme.background },
              ]}
            >
              <LargeButton
                title={"Đăng nhập bằng username"}
                onPress={function (): void {
                  throw new Error("Function not implemented.");
                }}
                theme={{ ...currentTheme, primary: "#FFFFFF", width: "60%" }}
              />
              <InputField
                label="Tên người dùng hoặc email"
                placeholder={"Tên người dùng hoặc email"}
                caption={error}
                hasError={showCaption}
                onTextChange={(username) => {
                  setUsername(username);
                  checkValidUsername(username);
                }}
                theme={currentTheme}
              />
              <View style={{ padding: 40 }} />

              {validUsername && (
                <LargeButton
                  onPress={handleLogin}
                  title="TIẾP TỤC"
                  theme={{ ...currentTheme, primary: "#FFFFFF" }}
                />
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </>
  );
};

export default LoginScreen;
