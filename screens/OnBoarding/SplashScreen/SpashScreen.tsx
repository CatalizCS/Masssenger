import React, { useEffect, useRef } from "react";
import { View, Text, Image, Animated } from "react-native";
import { styles } from "./styles";
import { theme } from "@/configs/theme";
import LargeButton from "@/components/LargeButton/LargeButton";
import { useAppSelector } from "@/store/store";
import { useNavigation } from "@react-navigation/native";

const SplashScreen = () => {
  const navigation = useNavigation();
  const currentTheme =
    theme[useAppSelector((state) => state.theme.currentTheme)];
  const [isReady, setIsReady] = React.useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      setIsReady(true);
    }, 3000);
  }, [fadeAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: currentTheme.background, opacity: fadeAnim },
      ]}
    >
      <Image source={require("@/assets/logo.png")} style={styles.logo} />
      <Text style={[styles.title, { color: currentTheme.primary }]}>
        Massenger
      </Text>
      <Text style={[styles.subtitle, { color: currentTheme.secondary }]}>
        Ứng dụng trò chuyện được phát triển bởi Tamaisme
      </Text>
      {isReady && (
        <LargeButton
          title="Get Started"
          onPress={() => navigation.navigate("Welcome" as never)}
          theme={{ ...currentTheme, primary: "#FFFFFF" }}
        />
      )}
      <Text style={[styles.footer, { color: currentTheme.secondary }]}>
        Made by Tamaisme
      </Text>
    </Animated.View>
  );
};

export default SplashScreen;
