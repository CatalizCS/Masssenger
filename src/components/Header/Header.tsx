import React, { useContext, useCallback, useMemo, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Profile } from "@/src/types/Profile";
import BottomDrawer from "../../screens/Home/Chats/NewMessage";
import { getAllProfiles } from "@/src/firebase/Services/Profile";
import { ChatsContext } from "../../contexts/ChatsContext";
import { RegistrationContext } from "@/src/contexts/RegistrationContext";
import { getMessages } from "@/src/firebase/Services/Message";
import { Chat, Message } from "@/src/types/Message";
import { Ionicons } from "@expo/vector-icons";

const ChatsHeader: React.FC<any> = () => {
  const navigation = useNavigation();
  const [isDrawerVisible, setIsDrawerVisible] = React.useState(false);
  const { Suggestions, setSuggestions } = useContext(ChatsContext);
  const { userInfo } = useContext(RegistrationContext);

  const fetchContacts = useCallback(async () => {
    try {
      const profiles = await getAllProfiles();

      const contacts = await Promise.all(
        profiles.map(async (profile: Profile) => {
          const getAllMessages = await getMessages(profile.userId).catch(
            () => []
          );
          
          return {
            chatId: profile.userId,
            userId: profile.userId,
            avatarUrl: profile.avatarUrl,
            chatName: `${profile.firstName} ${profile.lastName}`,
            messages: getAllMessages as Message[],
            participants: [profile.userId, userInfo?.userId].filter(Boolean),
            isGroupChat: false,
          };
        })
      );

      const newSuggestions = contacts.filter(
        (contact) => contact.userId !== userInfo?.userId
      );

      setSuggestions(newSuggestions as Chat[]);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  }, [Suggestions, setSuggestions, userInfo]);

  useEffect(() => {
    if (Suggestions.length === 0) fetchContacts();
  });

  const toggleDrawer = useCallback(
    () => setIsDrawerVisible((prev) => !prev),
    []
  );

  const memoizedBottomDrawer = useMemo(
    () => (
      <BottomDrawer
        isVisible={isDrawerVisible}
        onClose={toggleDrawer}
        contacts={Suggestions}
      />
    ),
    [isDrawerVisible, toggleDrawer, Suggestions]
  );

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      >
        <Ionicons name="menu" size={30} color="blue" />
      </TouchableOpacity>
      <Text style={styles.title}>Chats</Text>
      <TouchableOpacity onPress={toggleDrawer}>
        <Ionicons name="create-outline" size={24} color="blue" />
      </TouchableOpacity>
      {memoizedBottomDrawer}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export { ChatsHeader };
