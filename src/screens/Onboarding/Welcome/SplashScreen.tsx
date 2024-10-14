import React, { useEffect, useRef } from "react";
import { Text, Image, Animated, StyleSheet } from "react-native";
import { onBoardingTheme } from "@/src/contexts/Theme";
import Button from "@/src/components/Button/Button";
import { useAppSelector } from "@/src/stores/Theme";
import Layout from "@/src/contexts/Layout";

const SplashScreen: React.FC<any> = ({ navigation }) => {
  const currentTheme =
    onBoardingTheme[useAppSelector((state) => state.theme.currentTheme)];
  const [isReady, setIsReady] = React.useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    // After 5 seconds, show the button and set isReady to true
    setTimeout(() => {
      setIsReady(true);
      Animated.timing(buttonFadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();
    }, 100);
  }, [fadeAnim, buttonFadeAnim]);

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
        <Animated.View style={{ opacity: buttonFadeAnim }}>
          <Button
            title={"Bắt đầu"}
            type={"large"}
            onPress={function (): void {
              navigation.navigate("Welcome" as never);
            }}
            theme={{
              ...currentTheme,
              primary: "#FFFFFF",
              width: Layout.window.width / 2,
              backgroundColor: currentTheme.button_primary,
              text: "#FFFFFF",
            }}
          />
        </Animated.View>
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
