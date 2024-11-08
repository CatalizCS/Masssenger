import { initializeApp } from "firebase/app";
import {
  initializeAuth, // @ts-ignore
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyDpMQmoaMKjPJb1FayJdhOcV79a3sVUJSA",
//   authDomain: "massenger-af8fe.firebaseapp.com",
//   projectId: "massenger-af8fe",
//   storageBucket: "massenger-af8fe.appspot.com",
//   messagingSenderId: "623299557612",
//   appId: "1:623299557612:web:f41c00f22b97f410a60dc9",
// };

const firebaseConfig = {
  apiKey: "AIzaSyDFXDWC-Cxh-1qfrvrcmxRn9Is1hCdEDMk",
  authDomain: "massenger-wysi.firebaseapp.com",
  projectId: "massenger-wysi",
  storageBucket: "massenger-wysi.appspot.com",
  messagingSenderId: "128092772318",
  appId: "1:128092772318:web:1072488fb3cfcb8bf12f4f",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
