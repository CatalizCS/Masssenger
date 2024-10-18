import { updateProfile } from "@/src/firebase/Services/Profile";
import { Profile } from "@/src/types/Profile";
import React, { useCallback, useMemo } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const NoteBar: React.FC<{ currentUser: Profile; otherProfile: Profile[] }> = ({
  currentUser,
  otherProfile,
}) => {
  const [myProfile, setMyProfile] = React.useState<Profile | null>({
    ...currentUser,
  });
  const [isAddingNote, setIsAddingNote] = React.useState(false);
  const [note, setNote] = React.useState("");

  const otherProfiles = useMemo(() => otherProfile, [otherProfile]);

  const handleAddNote = useCallback(async () => {
    if (isAddingNote && myProfile) {
      try {
        await updateProfile(myProfile.userId, { ...myProfile, note: note });
        setMyProfile((prev) => (prev ? { ...prev, note: note } : null));
        setNote("");
      } catch (error) {
        console.error("Error updating note:", error);
      } finally {
        setIsAddingNote(false);
      }
    }
  }, [isAddingNote, myProfile, note]);

  return (
    <ScrollView
      horizontal
      style={styles.noteBarContainer}
      showsHorizontalScrollIndicator={false}
    >
      {/* MY NOTE */}
      <TouchableOpacity
        style={styles.noteItem}
        onPress={() => setIsAddingNote(true)}
      >
        <Image
          source={{ uri: currentUser.avatarUrl }}
          style={styles.noteAvatar}
        />
        <View style={styles.noteContent}>
          <Text style={styles.noteName}>Me</Text>

          {isAddingNote ? (
            <TextInput
              style={styles.noteTextInput}
              value={note}
              onChangeText={setNote}
              onSubmitEditing={handleAddNote} // Call handleAddNote when the user submits the note
            />
          ) : (
            <Text style={styles.noteText}>
              {myProfile?.note || "Post a note"}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {/* OTHERS' NOTES */}
      {otherProfiles.map((profile) => (
        <TouchableOpacity key={profile.userId} style={styles.noteItem}>
          <Image
            source={{ uri: profile.avatarUrl }}
            style={styles.noteAvatar}
          />
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
};

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
  noteTextInput: {
    width: 200,
    height: 40,
    borderRadius: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
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
