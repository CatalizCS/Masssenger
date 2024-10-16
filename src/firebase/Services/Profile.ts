import { db } from "@/src/firebase/firebase";
import { Profile } from "@/src/types/Profile";
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  onSnapshot,
} from "firebase/firestore";

export const getProfile = async (userId: string): Promise<Profile | null> => {
  const docRef = doc(db, "profiles", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as Profile;
  } else {
    return null;
  }
};

export const updateProfile = async (userId: string, profile: Profile) => {
  const docRef = doc(db, "profiles", userId);
  await setDoc(docRef, profile);
};

export const getAllProfiles = async (): Promise<Profile[]> => {
  const profiles: Profile[] = [];
  const querySnapshot = await getDocs(collection(db, "profiles"));

  querySnapshot.forEach((doc) => {
    profiles.push(doc.data() as Profile);
  });

  return profiles;
};

export const getAvatarProfile = async (userId: string): Promise<string> => {
  const docRef = doc(db, "profiles", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().avatarUrl;
  } else {
    return "";
  }
};

export const subscribeToProfiles = (
  callback: (profiles: Profile[]) => void
): (() => void) => {
  const unsubscribe = onSnapshot(collection(db, "profiles"), (snapshot) => {
    const profiles: Profile[] = [];
    snapshot.forEach((doc) => {
      profiles.push(doc.data() as Profile);
    });

    callback(profiles);
  });

  return unsubscribe;
};
