import React from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";

import PasswordInput from "./PasswordInput";
import RestorePassword from "./RestorePassword";
import { onBoardingTheme } from "@/constants/Theme";
import { useAppSelector } from "@/store/store";

const PasswordVerifyScreen: React.FC<any> = (navigation) => {
  const currentTheme =
    onBoardingTheme[useAppSelector((state) => state.theme.currentTheme)];

  const { usernameString } = navigation.route.params;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: currentTheme.primary }]}>
            Mật khẩu xác thực
          </Text>
          <Text style={styles.subtitle}>
            Mã xác thực đã được gửi đến số điện thoại hoặc email của bạn
          </Text>
        </View>
        <PasswordInput usernameString={usernameString} />
        <RestorePassword />
      </View>
    </View>
  );
};

export default PasswordVerifyScreen;
