import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { onBoardingTheme } from "@/constants/Theme";
import { useAppSelector } from "@/store/store";

const ResendOTP: React.FC = () => {
  const currentTheme =
    onBoardingTheme[useAppSelector((state) => state.theme.currentTheme)];
  const [countdown, setCountdown] = useState(60);

  // add cowndown timer

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 0) {
          clearInterval(interval);
          return 60;
        } else {
          return prev - 1;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.resendText}>
        Gửi lại mã xác thực (OTP) sau {countdown} giây
      </Text>
      <TouchableOpacity accessibilityRole="button">
        <Text style={[styles.alternativeText, { color: currentTheme.primary }]}>
          Thử cách khác
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    alignItems: "center",
  },
  resendText: {
    color: "rgba(21, 101, 192, 1)",
    fontFamily: "SF Pro Display, sans-serif",
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
  },
  alternativeText: {
    color: "rgba(117, 117, 117, 1)",
    fontFamily: "SF Pro Display, sans-serif",
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 30,
  },
});

export default ResendOTP;
