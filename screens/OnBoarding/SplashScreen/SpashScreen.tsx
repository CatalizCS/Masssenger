import React, { useEffect, useRef } from "react";
import { Text, Image, Animated, StyleSheet } from "react-native";
import { onBoardingTheme } from "@/constants/Theme";
import LargeButton from "@/components/LargeButton/LargeButton";
import { useAppSelector } from "@/store/store";
import { useNavigation } from "@react-navigation/native";

const SplashScreen = () => {
  const navigation = useNavigation();
  const currentTheme =
    onBoardingTheme[useAppSelector((state) => state.theme.currentTheme)];
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "OpenSans_700Bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "OpenSans_400Regular",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  footer: {
    fontSize: 12,
    fontFamily: "OpenSans_400Regular",
    position: "absolute",
    bottom: 20,
  },
});

export default SplashScreen;
