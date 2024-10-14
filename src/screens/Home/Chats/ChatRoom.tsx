import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  FlatList,
  Text,
} from "react-native";
import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import { Attachment, Message } from "@/src/types/Message";
import { RegistrationContext } from "@/src/contexts/RegistrationContext";
import { useNavigation } from "@react-navigation/native";
import { ChatRoomHeader } from "@/src/components/Header/Header";

const { width } = Dimensions.get("window");

const HeaderSection = React.memo(
  ({ imageUri, name }: { imageUri: string; name: string }) => {
    return (
      <View style={styles.headerContainer}>
        {imageUri && (
          <FastImage
            source={{ uri: imageUri }}
            style={styles.headerImage}
            resizeMode={FastImage.resizeMode.cover}
          />
        )}
        <Text style={styles.headerName}>{name}</Text>
      </View>
    );
  }
);

const MessageItem = React.memo(
  ({
    message,
    isMe,
    avatartUrl,
    attachments: Attachments,
  }: {
    message: string;
    isMe: boolean;
    avatartUrl?: string;
    attachments: Attachment[];
  }) => {
    const bgColor = isMe ? "#D2476F" : "#4f4f4f";
    const alignment = isMe ? "flex-end" : "flex-start";
    const flexAlignment = isMe ? "column" : "row";
    const radius = isMe
      ? { borderTopLeftRadius: 20 }
      : { borderBottomRightRadius: 20 };

    return (
      <View
        style={[
          styles.messageContainer,
          { alignItems: alignment, flexDirection: flexAlignment },
        ]}
      >
        {!isMe &&
          Attachments.map((attachment) => (
            <FastImage
              source={{ uri: attachment.url }}
              style={styles.messageProfileImage}
            />
          ))}

        <View
          style={[
            styles.messageBubble,
            { backgroundColor: bgColor, ...radius },
          ]}
        >
          {avatartUrl && (
            <FastImage
              source={{ uri: avatartUrl }}
              style={styles.messageImage}
            />
          )}
          <Text style={styles.messageText}>{message}</Text>
        </View>
      </View>
    );
  }
);

type RouteParams = {
  params: {
    avatarUrl: string;
    username: string;
    messages: Message[];
  };
};

const ChatRoomScreen: React.FC<any> = (navigator) => {
  const { avatarUrl, username, messages } = navigator.route.params;
  const navigation = useNavigation();
  const { userInfo } = useContext(RegistrationContext);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [message, setMessage] = useState("");

  console.log("ChatRoomScreen: ", messages, avatarUrl, username);

  useState(() => {
    navigation.setOptions({
      headerTitle: () => (
        <ChatRoomHeader
          username={username}
          imageUri={avatarUrl}
          status={false}
          onCallPress={() => {}}
          onVideoPress={() => {}}
        />
      ),
    });
  });

  const renderItem = useCallback(
    ({ item }: { item: Message }) => {
      return (
        <MessageItem
          message={item.message}
          isMe={item.senderId == userInfo?.userId}
          avatartUrl={avatarUrl}
          attachments={item.attachments as Attachment[]}
        />
      );
    },
    [messages]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.messageId.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <HeaderSection imageUri={avatarUrl} name={username} />
        }
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={5}
      />
      <View style={styles.inputContainer}>
        <FontAwesome5
          name="dice-four"
          size={30}
          color="#0C7EF2"
          style={styles.icons}
        />
        <Ionicons
          name="camera"
          size={30}
          color="#0C7EF2"
          style={styles.icons}
        />
        <FontAwesome
          name="photo"
          size={30}
          color="#0C7EF2"
          style={styles.icons}
        />
        <FontAwesome
          name="microphone"
          size={30}
          color="#0C7EF2"
          style={styles.icons}
        />
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => setMessage(text)}
          placeholder="Aa"
          value={message}
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
        />
        {/*  */}
        {message ? (
          <AntDesign
            name="arrowright"
            size={30}
            color="#0C7EF2"
            style={styles.icons}
          />
        ) : (
          <AntDesign
            name="like1"
            size={30}
            color="#0C7EF2"
            style={styles.icons}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  headerName: {
    fontSize: 22,
    paddingHorizontal: 10,
    fontWeight: "bold",
  },
  headerSubText: {
    fontSize: 18,
    color: "#4d4d4d",
  },
  viewProfileButton: {
    backgroundColor: "#4d4d4d",
    borderRadius: 20,
    padding: 10,
    marginVertical: 10,
  },
  headerDate: {
    fontSize: 18,
    color: "#4d4d4d",
  },
  messageContainer: {
    width: width,
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  messageProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  messageBubble: {
    maxWidth: width * 0.7,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 10,
  },
  messageImage: {
    width: width * 0.65,
    height: 150,
  },
  messageText: {
    fontSize: 16,
    padding: 10,
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#000",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    height: 40,
    borderColor: "#0C7EF2",
    borderWidth: 1,
    color: "#fff",
    flex: 1,
    borderRadius: 15,
    paddingLeft: 15,
    maxHeight: 100,
  },
  icons: {
    marginHorizontal: 5,
  },
});

export default ChatRoomScreen;
