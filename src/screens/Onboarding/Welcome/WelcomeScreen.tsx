import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import { onBoardingTheme } from "@/src/contexts/Theme";
import Button from "@/src/components/Button/Button";
import { useAppSelector } from "@/src/stores/Theme";

const WelcomeScreen: React.FC<any> = ({ navigation }) => {
  const currentTheme =
    onBoardingTheme[useAppSelector((state) => state.theme.currentTheme)];

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <Animated.Image
        source={require("@/assets/logo.png")}
        style={[styles.logo, { opacity: fadeAnim }]}
      />
      <Animated.Text
        style={[
          styles.title,
          {
            color: currentTheme.primary,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        Massenger
      </Animated.Text>

      <Animated.Text
        style={[
          styles.subtitle,
          { color: currentTheme.secondary, opacity: fadeAnim },
        ]}
      >
        Ứng dụng trò chuyện được phát triển bởi Tamaisme
      </Animated.Text>

      <Animated.Text
        style={[
          styles.description,
          { color: currentTheme.primary, opacity: fadeAnim },
        ]}
      >
        Massenger là ứng dụng trò chuyện hiện đại, giúp kết nối bạn với bạn bè
        và gia đình một cách dễ dàng. Hãy trải nghiệm tính năng nhắn tin, gọi
        điện và chia sẻ nội dung tiện lợi, nhanh chóng, mọi lúc, mọi nơi. Tham
        gia cộng đồng Massenger ngay hôm nay để tận hưởng các cuộc trò chuyện
        không giới hạn!
      </Animated.Text>

      <Button
        title={"Bắt đầu"}
        type={"large"}
        onPress={() => {
          navigation.navigate("Login" as never);
        }}
        theme={{
          ...currentTheme,
          primary: "#FFFFFF",
          width: "100%",
          backgroundColor: currentTheme.button_primary,
          text: "#FFFFFF",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
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
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    fontFamily: "OpenSans_400Regular",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 40,
  },
});

export default WelcomeScreen;
