import React from "react";
import { View, Text, Image, useColorScheme } from "react-native";
import { theme } from "@/configs/theme";
import LargeButton from "@/components/LargeButton/LargeButton";
import { styles } from "./styles";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector } from "@/store/store";

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const currentTheme =
    theme[useAppSelector((state) => state.theme.currentTheme)];

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <Image source={require("@/assets/logo.png")} style={styles.logo} />
      <Text style={[styles.title, { color: currentTheme.primary }]}>
        Massenger
      </Text>
      <Text style={[styles.subtitle, { color: currentTheme.secondary }]}>
        Ứng dụng trò chuyện được phát triển bởi Tamaisme
      </Text>
      <Text style={[styles.description, { color: currentTheme.primary }]}>
        Massenger là ứng dụng trò chuyện hiện đại, giúp kết nối bạn với bạn bè
        và gia đình một cách dễ dàng. Hãy trải nghiệm tính năng nhắn tin, gọi
        điện và chia sẻ nội dung tiện lợi, nhanh chóng, mọi lúc, mọi nơi. Tham
        gia cộng đồng Massenger ngay hôm nay để tận hưởng các cuộc trò chuyện
        không giới hạn!
      </Text>
      <LargeButton
        title="TIẾP TỤC"
        onPress={() => {
          navigation.navigate("Login" as never);
        }}
        theme={{ ...currentTheme, primary: "#FFFFFF" }}
      />
    </View>
  );
};

export default WelcomeScreen;
``;
