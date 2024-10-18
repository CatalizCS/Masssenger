import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Video from "react-native-video";
import { Story } from "@/src/types/Profile";

type StoryModalProps = {
  visible: boolean;
  stories: Story[];
  onClose: () => void;
};

const StoryModal: React.FC<StoryModalProps> = ({
  visible,
  stories,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<any>(null);
  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    if (visible) {
      setCurrentIndex(0); // Reset story khi mở modal
    }
  }, [visible]);

  useEffect(() => {
    const currentStory = stories[currentIndex];
    let timer: NodeJS.Timeout;

    if (currentStory.videoUrl) {
      videoRef.current?.seek(0);
    } else {
      timer = setTimeout(() => {
        nextStory();
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [currentIndex]);

  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const prevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentStory = stories[currentIndex];

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
      <View
        style={{ flex: 1, backgroundColor: "black", justifyContent: "center" }}
      >
        {currentStory.videoUrl ? (
          <Video
            ref={videoRef}
            source={{ uri: currentStory.videoUrl }}
            style={{ width, height }}
            resizeMode="contain"
            onEnd={nextStory}
          />
        ) : (
          <Image
            source={{ uri: currentStory.imageUrl }}
            style={{ width, height, resizeMode: "contain" }}
          />
        )}

        {/* Phần trên và dưới để chuyển story */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 50,
            flexDirection: "row",
          }}
        >
          <TouchableOpacity style={{ flex: 1 }} onPress={prevStory} />
          <TouchableOpacity style={{ flex: 1 }} onPress={nextStory} />
        </View>

        {/* Nút đóng modal */}
        <TouchableOpacity
          style={{ position: "absolute", top: 40, right: 20 }}
          onPress={onClose}
        >
          <Text style={{ color: "white", fontSize: 18 }}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default StoryModal;
