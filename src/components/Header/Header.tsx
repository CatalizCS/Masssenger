import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Profile } from "@/src/types/Profile";
import BottomDrawer, { Contact } from "../Drawer/NewMessageDrawer";
import { getAllProfiles } from "@/src/firebase/Services/Profile";
import { ChatsContext } from "../../contexts/ChatsContext";

const ChatsHeader: React.FC<any> = ({ navigation }) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const { Suggestions, setSuggestions } = useContext(ChatsContext);

  useState(() => {
    async function fetchContacts() {
      const profiles = await getAllProfiles();

      const contacts = profiles.map((profile: Profile) => ({
        id: profile.userId,
        name: `${profile.firstName} ${profile.lastName}`,
        avatar: profile.avatarUrl,
        status: profile.isOnline,
      }));

      // checking if the contact is already in the chat list
      const newSuggestions = contacts.filter(
        (contact) =>
          !Suggestions.some((suggestion) => suggestion.id === contact.id)
      );

      setSuggestions(newSuggestions);
    }

    fetchContacts();
  });

  return (
    <View style={ChatListStyles.header}>
      <TouchableOpacity onPressIn={() => DrawerActions.openDrawer()}>
        <Image
          source={require("@/assets/icons/hamburger.png")}
          style={ChatListStyles.icon}
        />
      </TouchableOpacity>
      <Text style={ChatListStyles.title}>Chats</Text>
      <TouchableOpacity onPressIn={() => setIsDrawerVisible(true)}>
        <Image
          source={require("@/assets/icons/new-message.png")}
          style={ChatListStyles.icon}
        />
      </TouchableOpacity>
      <BottomDrawer
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        contacts={Suggestions}
      />
    </View>
  );
};

export interface ChatRoomHeaderProps {
  username: string;
  imageUri: string;
  status: boolean;
  onCallPress: () => void;
  onVideoPress: () => void;
}

const ChatRoomHeader: React.FC<ChatRoomHeaderProps> = ({
  username,
  imageUri,
  status,
  onCallPress,
  onVideoPress,
}) => {
  const navigation = useNavigation();
  console.log("ChatRoomHeaderProps", username, imageUri, status);
  return (
    <View style={ChatRoomStyles.container}>
      <StatusBar style="light" />
      <View style={ChatRoomStyles.headerContent}>
        <View style={ChatRoomStyles.leftSection}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={ChatRoomStyles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={ChatRoomStyles.userInfo}>
            <Image source={{ uri: imageUri }} style={ChatRoomStyles.avatar} />
            <View>
              <Text style={ChatRoomStyles.name}>{username}</Text>
              <Text style={ChatRoomStyles.status}>{status}</Text>
            </View>
          </View>
        </View>
        <View style={ChatRoomStyles.rightSection}>
          <TouchableOpacity
            onPress={onCallPress}
            style={ChatRoomStyles.iconButton}
          >
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onVideoPress}>
            <Ionicons name="videocam" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const ChatListStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#ffffff",
  },
  title: {
    color: "#000000",
    fontSize: 25,
    fontWeight: "600",
  },
  icon: {
    width: 45,
    height: 45,
  },
});

const ChatRoomStyles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  status: {
    color: "#A0A0A0",
    fontSize: 14,
  },
  rightSection: {
    flexDirection: "row",
  },
  iconButton: {
    marginRight: 15,
  },
});
export { ChatsHeader, ChatRoomHeader };
