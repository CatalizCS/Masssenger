import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ToastProps {
  visible: boolean;
  title: string;
  message: string;
  onHide: () => void;
}

const NotificationToast: React.FC<ToastProps> = ({
  visible,
  title,
  message,
  onHide,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(onHide, 1000);
      });
    }
  }, [visible, opacity, onHide]);

  if (!visible) return null;

  return (
    <TouchableOpacity onPress={onHide}>
      <Modal transparent={true} visible={visible} animationType="fade">
        <View style={styles.overlay}>
          <Animated.View style={[styles.container, { opacity }]}>
            <View style={styles.toast}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.text}>{message}</Text>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0)",
    paddingTop: 40,
  },
  container: {
    alignItems: "center",
    alignSelf: "center",
  },
  toast: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 20,
    padding: 15,
    maxWidth: "80%",
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  text: {
    color: "#fff",
    textAlign: "center",
  },
});


export default NotificationToast;
