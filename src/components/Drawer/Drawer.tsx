import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  badge?: number;
}

interface Community {
  image: string;
  name: string;
}

interface DrawerProps {
  userName: string;
  userAvatar: string;
  menuItems: MenuItem[];
  communities: Community[];
  onSettingsPress: () => void;
  onMenuPress: () => void;
  onLogout: () => void;
}

const DrawerMenu: React.FC<DrawerProps> = ({
  userName,
  userAvatar,
  menuItems,
  communities,
  onSettingsPress,
  onMenuPress,
  onLogout,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image source={{ uri: userAvatar }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <TouchableOpacity
            onPress={onSettingsPress}
            style={styles.settingsButton}
          >
            <Ionicons name="settings" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onMenuPress}
            style={styles.menuButton}
          ></TouchableOpacity>
        </View>

        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={24} color="black" />
              </View>
              <Text style={styles.menuItemText}>{item.label}</Text>
            </View>
            {(item.badge && item.badge > 0) && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.badge.toString()}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.communitiesHeader}>
          <Text style={styles.communitiesTitle}>Communities</Text>
          <TouchableOpacity>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        </View>

        {communities.map((community, index) => (
          <TouchableOpacity key={index} style={styles.communityItem}>
            <Image
              source={{ uri: community.image }}
              style={styles.communityImage}
            />
            <Text style={styles.communityName}>{community.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 4,
  },
  settingsButton: {
    marginRight: 5,
  },
  menuButton: {
    padding: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  menuItemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 32,
    alignItems: "center",
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
  badge: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  communitiesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  communitiesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
  editButton: {
    color: "#007AFF",
    fontSize: 16,
  },
  communityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  communityImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  communityName: {
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  logoutText: {
    fontSize: 16,
    color: "#FF3B30",
    marginLeft: 12,
  },
});

export default DrawerMenu;
