import React, { useContext, useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
} from "react-native";
import StoryModal from "./StoryModal";
import { Stories, Story, Profile } from "@/src/types/Profile";
import { RegistrationContext } from "@/src/contexts/RegistrationContext";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Ionicons";
import { showErrorToast } from "@/src/components/Toast/Toast";
import { storage } from "@/src/firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import * as StoriesService from "@/src/firebase/Services/Stories";
import * as ProfileService from "@/src/firebase/Services/Profile";

const StoriesScreen: React.FC<any> = () => {
  const { userInfo } = useContext(RegistrationContext);
  const [stories, setStories] = useState<Stories[]>([]);
  const [selectedStories, setSelectedStories] = useState<Stories | null>(null);
  const [profiles, setProfiles] = useState<{ [key: string]: Profile }>({});

  useEffect(() => {
    async function fetchStories() {
      const fetchedStories = await StoriesService.getStories().catch(
        (error) => {
          console.error("Error fetching stories:", error);
          showErrorToast("Không thể tải stories");
        }
      );

      if (!fetchedStories) return;

      console.log("Fetched stories:", fetchedStories);
      setStories(fetchedStories);

      const profiles = await ProfileService.getAllProfiles();
      const profilesMap: { [key: string]: Profile } = {};
      profiles.forEach((profile) => {
        profilesMap[profile.userId] = profile;
      });

      setProfiles(profilesMap);
    }

    fetchStories();
  }, [userInfo]);

  const uploadStory = async (stories: Stories) => {
    console.log("Uploading story:", stories);
    await StoriesService.uploadStory(stories).catch((error) => {
      console.error("Error uploading story:", error);
      showErrorToast("Không thể tải lên story");
    });
  };

  const handleAddStory = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showErrorToast("Quyền truy cập thư viện ảnh bị từ chối");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    }).catch((error) => {
      console.error("Error opening library:", error);
      showErrorToast("Không thể mở thư viện");
    });

    if (result?.canceled) {
      showErrorToast("Quyền truy cập thư viện ảnh bị từ chối");
      return;
    }

    if (result && !result.canceled && result.assets) {
      const uri = result.assets[0].uri;
      const response = await fetch(uri);
      const storageRef = ref(
        storage,
        `stories/${userInfo?.userId}/${Date.now()}`
      );
      const snapshot = await uploadBytes(storageRef, await response.blob());
      const downloadUrl = await getDownloadURL(snapshot.ref);

      const newStories: Story[] = await Promise.all(
        result.assets.map(async (asset, index) => ({
          id: String(Date.now() + index),
          imageUrl: downloadUrl ?? "",
          videoUrl: asset.type?.includes("video") ? downloadUrl ?? "" : "",
          postedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        }))
      );

      uploadStory({
        profileId: userInfo?.userId || "",
        stories: newStories,
      });

      setStories((prevStories) => [
        {
          profileId: userInfo?.userId || "",
          stories: newStories,
        },
        ...prevStories,
      ]);
    }
  };

  const handleSelectStory = (story: Stories) => {
    setSelectedStories(story);
  };

  const handleCloseModal = () => {
    setSelectedStories(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.addStoryContainer}>
        <TouchableOpacity
          onPress={handleAddStory}
          style={styles.addStoryButton}
        >
          <Icon name="add-circle" size={40} color="#000" />
          <Text style={styles.addStoryText}>Thêm Story</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={stories}
        keyExtractor={(item) => `${item.profileId}-${item.stories[0].id}`}
        renderItem={({ item }) => {
          console.log("item", profiles[item.profileId]);
          const profileName = profiles[item.profileId]
            ? `${profiles[item.profileId].firstName} ${
                profiles[item.profileId].lastName
              }`
            : "Loading...";

          return (
            <TouchableOpacity onPress={() => handleSelectStory(item)}>
              <Image
                source={{ uri: item.stories[0].imageUrl }}
                style={styles.avatar}
              />
              <Text style={styles.username}>{profileName}</Text>
            </TouchableOpacity>
          );
        }}
        horizontal
      />

      {/* Modal story chi tiết */}
      {selectedStories && (
        <StoryModal
          visible={!!selectedStories}
          stories={selectedStories.stories}
          onClose={handleCloseModal}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    margin: 10,
  },
  username: {
    textAlign: "center",
    color: "#000",
  },
  addStoryContainer: {
    alignItems: "center",
    margin: 10,
  },
  addStoryButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addStoryText: {
    color: "#000",
    marginLeft: 10,
    fontSize: 16,
  },
});

export default StoriesScreen;
