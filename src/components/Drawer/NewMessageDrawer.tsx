import React, { useRef, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Modal,
  Animated,
  TextInput,
} from "react-native";
import Layout from "@/src/contexts/Layout";
import { Chat } from "@/src/types/Message";
import { RegistrationContext } from "@/src/contexts/RegistrationContext";
import * as messageService from "@/src/firebase/Services/Message";
import { showSuccessToast } from "../Toast/Toast";

interface BottomDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  contacts: Chat[];
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({
  isVisible,
  onClose,
  contacts,
}) => {
  const slideAnim = useRef(new Animated.Value(Layout.window.height)).current;
  const { userInfo } = useContext(RegistrationContext);
  const [filteredContacts, setFilteredContacts] = React.useState<Chat[]>([]);

  // Hàm tạo cuộc trò chuyện mới
  const createNewChat = useCallback(
    async (chat: Chat) => {
      try {
        await messageService.createNewChat(chat);
        showSuccessToast("Chat created successfully");
        onClose();
      } catch (error) {
        console.error("Error creating chat:", error);
      }
    },
    [onClose]
  );

  // Hàm lấy danh sách chat và lọc các liên hệ đã tồn tại trong chats
  const getChats = useCallback(
    async (userId: string) => {
      try {
        const chats = await messageService.getChats(userId);

        console.log("Chats:", chats);
        const chatIds = chats
          .filter((chat) => !chat.isGroupChat)
          .flatMap((chat) => chat.participants);

        // Lọc contacts chưa có trong danh sách chat
        const filtered = contacts.filter(
          (contact) => !chatIds.includes(contact.userId) && chatIds.length > 2
        );

        setFilteredContacts(filtered);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    },
    [contacts]
  );

  useEffect(() => {
    if (userInfo) {
      getChats(userInfo.userId);
    }
  }, [userInfo, getChats]);

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

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.drawerContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>New message</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={{ flexDirection: "column" }}>
            <TextInput
              placeholder="To:"
              style={[styles.toLabel, { padding: 16, fontSize: 16 }]}
            />
            <TextInput
              placeholder="Search"
              style={{ padding: 16, fontSize: 16 }}
            />
          </View>

          <Text style={styles.sectionTitle}>Suggested</Text>

          <FlatList
            data={filteredContacts}
            keyExtractor={(contact) => contact.userId}
            renderItem={({ item: contact }) => {
              const {
                userId,
                avatarUrl,
                chatName,
                messages,
                participants,
                isGroupChat,
              } = contact;
              const selfId = userInfo?.userId || "";

              return (
                <TouchableOpacity
                  key={userId}
                  style={styles.contactItem}
                  onPress={() =>
                    createNewChat({
                      chatId: userId,
                      userId: selfId,
                      avatarUrl,
                      chatName,
                      messages,
                      participants,
                      isGroupChat,
                    })
                  }
                >
                  <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                  <Text style={styles.contactName}>{chatName}</Text>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.sectionTitle}>No contacts</Text>
            }
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  drawerContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  cancelButton: {
    color: "#007AFF",
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  placeholder: {
    width: 50,
  },
  toLabel: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
    padding: 16,
  },
  contactItem: {
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
    marginRight: 16,
  },
  contactName: {
    fontSize: 16,
  },
});

export default BottomDrawer;
