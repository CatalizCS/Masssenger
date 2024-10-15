import React, { useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Modal,
  Animated,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Layout from "@/src/contexts/Layout";
import { useNavigation } from "@react-navigation/native";
import { Chat } from "@/src/types/Message";
import { RegistrationContext } from "@/src/contexts/RegistrationContext";

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
  const navigation = useNavigation();

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
  }, [isVisible]);

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

          <ScrollView style={styles.content}>
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

            <TouchableOpacity style={styles.option}>
              <Ionicons name="people" size={24} color="black" />
              <Text style={styles.optionText}>Create a new group</Text>
              <Ionicons name="chevron-forward" size={24} color="gray" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.option}>
              <Ionicons name="chatbubbles" size={24} color="black" />
              <Text style={styles.optionText}>Community</Text>
              <Ionicons name="chevron-forward" size={24} color="gray" />
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Suggested</Text>

            {contacts.length > 0 ? (
              contacts.map((contact) => {
                const chatId = contact.chatId;
                const userId = contact.userId;
                const selfId = userInfo?.userId;
                const avatarUrl = contact.avatarUrl;
                const chatName = contact.chatName;
                const messages = contact.messages ?? [];
                const readStatus = contact.readStatus ?? [];
                const participants = contact.participants ?? [];
                const isGroupChat = contact.isGroupChat ?? false;

                return (
                  <TouchableOpacity
                    key={chatId}
                    style={styles.contactItem}
                    onPress={() =>
                      navigation.navigate(
                        // @ts-ignore
                        "ChatRoom",
                        {
                          chatId,
                          userId,
                          selfId,
                          avatarUrl,
                          chatName,
                          messages,
                          readStatus,
                          participants,
                          isGroupChat,
                        }
                      )
                    }
                  >
                    <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                    <Text style={styles.contactName}>{chatName}</Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={styles.sectionTitle}>No contacts</Text>
            )}
          </ScrollView>
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
  content: {
    flex: 1,
  },
  toLabel: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  optionText: {
    fontSize: 16,
    marginLeft: 16,
    flex: 1,
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
  onlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "green",
    position: "absolute",
    right: 16,
  },
});

export default BottomDrawer;
