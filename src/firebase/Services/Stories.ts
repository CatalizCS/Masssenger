import { db } from "@/src/firebase/firebase";
import { Stories, Story } from "@/src/types/Profile";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const getStories = async (): Promise<Stories[]> => {
  const stories: Stories[] = [];

  const querySnapshot = await getDocs(collection(db, "stories"));
  querySnapshot.forEach((doc) => {
    const story = doc.data() as Stories;

    stories.push(story);
  });

  return stories;
};

export const updateStory = async (stories: Stories) => {
  const storiesRef = doc(db, "stories", "stories");
  await setDoc(storiesRef, stories, { merge: true });
};

export const getStory = async (storyId: string): Promise<Story> => {
  const storyRef = doc(db, "stories", storyId);
  const storyDoc = await getDoc(storyRef);

  if (storyDoc.exists()) {
    return storyDoc.data() as Story;
  } else {
    throw new Error("Story not found");
  }
};

export const getStoriesByUserId = async (userId: string): Promise<Stories> => {
  const storiesRef = doc(db, "stories", userId);
  const storiesDoc = await getDoc(storiesRef);

  if (storiesDoc.exists()) {
    return storiesDoc.data() as Stories;
  } else {
    throw new Error("Stories not found");
  }
};

export const uploadStory = async (story: Stories) => {
  console.log("Uploading story:", story);
  const newDocRef = doc(collection(db, "stories"));
  await setDoc(newDocRef, story).catch((error) => {
    console.error("Error adding story: ", error);
  });
};

export const deleteStory = async (storyId: string) =>
  await setDoc(doc(db, "stories", storyId), { isDeleted: true });
