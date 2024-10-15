// // import { useContext, useEffect, useState } from "react";
// // import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
// // import {
// //   getChats,
// //   sortChatWithLastMessage,
// // } from "@/src/firebase/Services/Message";
// // import { Chat } from "@/src/types/Message";
// // import { RegistrationContext } from "@/src/contexts/RegistrationContext";
// // import ChatList from "@/src/components/Chats/ChatList";
// // import { ChatsContext } from "@/src/contexts/ChatsContext";

// // const HomeScreen: React.FC<any> = () => {
// //   const { userInfo } = useContext(RegistrationContext);
// //   const { chatList, setChatList } = useContext(ChatsContext);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     async function fetchChatData() {
// //       try {
// //         if (!userInfo) {
// //           setLoading(false);
// //           return;
// //         }

// //         const chats = await getChats(userInfo.userId);
// //         console.log("chats", chats);
// //         const sortedChats = sortChatWithLastMessage(chats);

// //         setChatList(sortedChats);
// //         setLoading(false);
// //       } catch (error) {
// //         setLoading(false);
// //       }
// //     }

// //     fetchChatData();
// //   });

// //   if (loading) {
// //     return (
// //       <View style={styles.container}>
// //         <ActivityIndicator size="large" color="#0000ff" />
// //       </View>
// //     );
// //   }

// //   return (
// //     <View style={styles.container}>
// //       {chatList.length != 0 ? (
// //         <ChatList chats={chatList} />
// //       ) : (
// //         <View>
// //           <Text style={styles.text}>Không có cuộc trò chuyện nào</Text>
// //         </View>
// //       )}
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   text: {
// //     fontSize: 20,
// //     fontWeight: "bold",
// //   },
// // });

// export default HomeScreen;
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { RegistrationContext } from "@/src/contexts/RegistrationContext";
import { Profile } from "@/src/types/Profile";
import { Chat } from "@/src/types/Message";

import SearchBar from "@/src/components/Search/SearchBar";
import NoteBar from "@/src/components/Chats/Notes";
import ChatItem from "@/src/components/Chats/ChatList";
import Loading from "../../Loading/Loading";
import {
  getChats,
  sortChatWithLastMessage,
} from "@/src/firebase/Services/Message";
import { getAllProfiles } from "@/src/firebase/Services/Profile";

const HomeScreen: React.FC<any> = () => {
  const { userInfo } = useContext(RegistrationContext);
  const [chatList, setChatList] = React.useState<Chat[]>([]);
  const [otherProfile, setOtherProfile] = React.useState<Profile[]>([]);
  const [loading, setLoading] = React.useState(true);

  if (loading && !userInfo) {
    return <Loading />;
  }

  // update chatList real-time
  useState(() => {
    async function fetchChatData() {
      try {
        if (!userInfo) {
          return;
        }

        const chats = await getChats(userInfo.userId);
        const sortedChats = sortChatWithLastMessage(chats);

        const profiles = await getAllProfiles();
        setOtherProfile(
          profiles.filter((profile) => profile.userId !== userInfo.userId)
        );

        setChatList(sortedChats);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }

    fetchChatData();
  });

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar />
      <ScrollView>
        {userInfo && (
          <NoteBar currentUser={userInfo} otherProfile={otherProfile} />
        )}
        {chatList.map((chat) => (
          <ChatItem
            key={chat.chatId}
            chat={chat}
            currentUserId={userInfo?.userId || ""}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
