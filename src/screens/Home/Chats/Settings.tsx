import React, { useRef, useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Animated,
  StatusBar,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Layout from "@/src/contexts/Layout";
import { RegistrationContext } from "@/src/contexts/RegistrationContext";
import { auth } from "@/src/firebase/firebase";

interface SettingDrawerProps {
  isVisible: boolean;
  onClose: () => void;
}

const SettingsDrawer: React.FC<SettingDrawerProps> = ({
  isVisible,
  onClose,
}) => {
  const { userInfo } = useContext(RegistrationContext);
  const slideAnim = useRef(new Animated.Value(Layout.window.height)).current;
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: Layout.window.height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnim]);

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
  }, []);

  const toggleActive = () => setIsActive((prev) => !prev);

  const handleLogout = async () => {
    try {
      auth.signOut();
      onClose();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.dragIndicator} />
        <ScrollView style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Settings</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.doneButton}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileSection}>
            <Image
              source={{ uri: userInfo?.avatarUrl }}
              style={styles.profileImage}
            />
            <Text
              style={styles.profileName}
            >{`${userInfo?.firstName} ${userInfo?.lastName}`}</Text>
          </View>

          <View style={styles.settingsList}>
            <SettingsItem
              icon="alert-circle-outline"
              title="View security alerts"
              badge={1}
            />
            <SettingsItem
              icon="chatbubble-ellipses-outline"
              title="Active status"
              toggle={isActive}
              initialValue={isActive}
              onPress={toggleActive}
            />
            <SettingsItem icon="accessibility-outline" title="Accessibility" />
            <SettingsItem
              icon="shield-checkmark-outline"
              title="Privacy & safety"
            />
            <SettingsItem
              icon="briefcase-outline"
              title="Professional settings"
            />

            {/* Logout button */}
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={handleLogout}
            >
              <Ionicons
                name="log-out-outline"
                size={24}
                color="black"
                style={styles.settingsIcon}
              />
              <Text style={styles.settingsText}>Log out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

interface SettingsItemProps {
  icon: string;
  title: string;
  badge?: number;
  toggle?: boolean;
  initialValue?: boolean;
  onPress?: () => void;
}

const SettingsItem = ({
  icon,
  title,
  badge,
  toggle,
  initialValue,
  onPress,
}: SettingsItemProps) => {
  return (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <Ionicons
        name={icon as any}
        size={24}
        color="black"
        style={styles.settingsIcon}
      />
      <Text style={styles.settingsText}>{title}</Text>
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge.toString()}</Text>
        </View>
      )}
      {toggle && <Switch value={initialValue} onValueChange={() => {}} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#F2F2F7",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 10,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  doneButton: {
    color: "#007AFF",
    fontSize: 16,
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  settingsList: {
    backgroundColor: "white",
    borderRadius: 10,
    marginHorizontal: 16,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  settingsIcon: {
    marginRight: 16,
  },
  settingsText: {
    flex: 1,
    fontSize: 16,
  },
  badge: {
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default SettingsDrawer;
