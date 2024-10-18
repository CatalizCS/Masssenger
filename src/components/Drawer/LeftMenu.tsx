import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RegistrationContext } from "@/src/contexts/RegistrationContext";
import { getChats } from "../../firebase/Services/Message";
import { useNavigation } from "@react-navigation/native";
import { Chat } from "@/src/types/Message";
import { getProfile } from "@/src/firebase/Services/Profile";
import SettingsDrawer from "@/src/screens/Home/Chats/Settings";

interface MenuItem {
  id?: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  badge?: string;
  onclick?: () => void;
}

interface Community {
  image: string;
  name: string;
}

interface DrawerProps {
  onMenuPress: () => void;
  onLogout: () => void;
}

const DrawerMenu: React.FC<DrawerProps> = ({ onMenuPress, onLogout }) => {
  const navigation = useNavigation();
  const { userInfo } = useContext(RegistrationContext);
  const [userName, setUserName] = useState<string>("");
  const [userAvatar, setUserAvatar] = useState<string>("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setUserName(`${userInfo?.firstName} ${userInfo?.lastName}`);
      setUserAvatar(userInfo?.avatarUrl ?? "https://example.com/avatar.jpg");
      setMenuItems([
        {
          icon: "chatbubbles",
          label: "Chats",
          badge: "1",
          onclick: () => {
            navigation.navigate("Home" as never);
          },
        },
      ]);
      setCommunities([]);
    }
  }, [userInfo]);

  const updateBadge = (index: number, badge: string) => {
    setMenuItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, badge } : item))
    );
  };

  useEffect(() => {
    async function getChatName(chat: Chat) {
      if (!chat.isGroupChat) {
        const otherParticipant = chat.participants.filter(
          (participant) => participant !== userInfo?.userId
        );
        const profile = await getProfile(otherParticipant[0]);
        return `${profile?.firstName} ${profile?.lastName}`;
      } else {
        return chat.chatName;
      }
    }

    async function getChatBadge() {
      if (!userInfo) return;

      const chat = await getChats(userInfo?.userId);
      const badge = chat.length.toString();
      updateBadge(0, badge);

      // add more badges chat and when click navigate to chat room
      chat.forEach(async (chat) => {
        const chatName = await getChatName(chat);

        // check if chat exist in menuItems
        const isExist = menuItems.some((item) => item.id === chat.chatId);

        if (isExist) {
          return;
        }

        console.log("chat", chat);

        const chatId = chat.chatId;
        const userId = chat.userId;
        const messages = chat.messages ?? [];
        const participants = chat.participants ?? [];
        const isGroupChat = chat.isGroupChat ?? false;

        const badge: MenuItem = {
          id: chat.chatId,
          icon: "chatbubbles",
          label: chatName,
          onclick: () => {
            //@ts-ignore
            navigation.navigate("ChatRoom", {
              chatId,
              userId,
              messages,
              participants,
              isGroupChat,
            });
          },
        };

        // filter out existing menuItems and add new chat badge
        setMenuItems((prev) => [...prev.filter((item) => !item.id), badge]);
      });
    }

    getChatBadge();
  }, [userInfo]);

  const toggleDrawer = useCallback(
    () => setIsDrawerVisible((prev) => !prev),
    []
  );

  const memoizedBottomDrawer = useMemo(
    () => <SettingsDrawer isVisible={isDrawerVisible} onClose={toggleDrawer} />,
    [isDrawerVisible, toggleDrawer]
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image source={{ uri: userAvatar }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <TouchableOpacity
            onPress={toggleDrawer}
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
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onclick}
          >
            <View style={styles.menuItemContent}>
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={24} color="black" />
              </View>
              <Text style={styles.menuItemText}>{item.label}</Text>
            </View>
            {item.badge && (
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
      {memoizedBottomDrawer}
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
