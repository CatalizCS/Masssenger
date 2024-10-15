import { Profile } from "@/src/types/Profile";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const NoteBar: React.FC<{ currentUser: Profile; otherProfile: Profile[] }> = ({
  currentUser,
  otherProfile,
}) => (
  <ScrollView
    horizontal
    style={styles.noteBarContainer}
    showsHorizontalScrollIndicator={false}
  >
    {/* MY NOTE */}
    <TouchableOpacity style={styles.noteItem}>
      <Image
        source={{ uri: currentUser.avatarUrl }}
        style={styles.noteAvatar}
      />
      <View style={styles.noteContent}>
        <Text style={styles.noteName}>Me</Text>
        <Text style={styles.noteText}>{currentUser.note || "Post a note"}</Text>
      </View>
    </TouchableOpacity>

    {/* OTHERS' NOTES */}
    {otherProfile.map((profile) => (
      <TouchableOpacity key={profile.userId} style={styles.noteItem}>
        <Image source={{ uri: profile.avatarUrl }} style={styles.noteAvatar} />
        <View style={styles.noteContent}>
          <Text
            style={styles.noteName}
          >{`${profile.firstName} ${profile.lastName}`}</Text>
          <Text style={styles.noteText}>{profile.note || "No note yet"}</Text>
        </View>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  noteBarContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  noteItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
  },
  noteAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  noteContent: {
    justifyContent: "center",
  },
  noteName: {
    fontWeight: "bold",
    fontSize: 14,
  },
  noteText: {
    color: "gray",
    fontSize: 12,
  },
});

export default NoteBar;
