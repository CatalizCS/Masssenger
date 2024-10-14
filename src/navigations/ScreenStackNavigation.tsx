import React, { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { User, onAuthStateChanged } from "firebase/auth";
import { getProfile } from "../firebase/Services/Profile";
import { Profile } from "@/src/types/Profile";
import { auth } from "@/src/firebase/firebase";

import { RegistrationContext } from "@/src/contexts/RegistrationContext";

import Loading from "@/src/screens/Loading/Loading";
import SplashScreen from "@/src/screens/Onboarding/Welcome/SplashScreen";
import WelcomeScreen from "../screens/Onboarding/Welcome/WelcomeScreen";
import LoginScreen from "../screens/Onboarding/Login/loginScreen";
import RegisterScreen from "../screens/Onboarding/Login/RegisterScreen";
import ForgotScreen from "../screens/Onboarding/Login/ForgotScreen";

import { ChatRoomHeader, ChatsHeader } from "../components/Header/Header";
import HomeScreen from "../screens/Home/Chats/HomeScreen";
import DrawerContent from "../components/Drawer/Drawer";
import { Contact } from "../components/Drawer/NewMessageDrawer";
import { ChatsContext } from "../contexts/ChatsContext";
import ChatRoomScreen from "../screens/Home/Chats/ChatRoom";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const ScreenStackNavigation: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [Suggestions, setSuggestions] = useState<Contact[]>([]);
  const [userInfo, setUserInfo] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      async function getUserInfo(userId: string) {
        const profile = await getProfile(userId);

        if (profile) {
          setUserInfo(profile);
        }
      }

      if (user) {
        setUser(user);
        getUserInfo(user.uid);
      }
    });

    setLoading(false);
    return unsubscribe;
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <RegistrationContext.Provider
      value={{ user, setUser, userInfo, setUserInfo }}
    >
      {!user ? (
        <Stack.Navigator initialRouteName="Splash">
          <>
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="ForgotPassword"
              component={ForgotScreen}
              options={{ headerShown: false }}
            />
          </>
        </Stack.Navigator>
      ) : (
        <>
          <ChatsContext.Provider value={{ Suggestions, setSuggestions }}>
            <Drawer.Navigator
              initialRouteName=""
              drawerContent={(props) => (
                <DrawerContent
                  userName="Vũ Nguyễn Thành Tâm"
                  userAvatar="https://example.com/avatar.jpg"
                  menuItems={[
                    { icon: "chatbubbles", label: "Chats", badge: 5 },
                    { icon: "storefront", label: "Marketplace" },
                    { icon: "mail", label: "Message requests" },
                    { icon: "archive", label: "Archive" },
                  ]}
                  communities={[
                    {
                      image: "https://example.com/community1.jpg",
                      name: "Osu! Việt Nam Commmunity",
                    },
                    // ... other communities
                  ]}
                  onSettingsPress={() => {
                    /* Handle settings press */
                  }}
                  onMenuPress={() => {
                    /* Handle menu press */
                  }}
                />
              )}
              screenOptions={{
                headerShown: false,
                drawerActiveBackgroundColor: "#aa18ea",
                drawerActiveTintColor: "#fff",
                drawerInactiveTintColor: "#333",
                drawerLabelStyle: {
                  fontFamily: "OpenSans_400Regular",
                  fontSize: 15,
                },
              }}
            >
              <Drawer.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  headerShown: true,
                  header: () => {
                    return <ChatsHeader />;
                  },
                }}
              />

              <Drawer.Screen
                name="ChatRoom"
                component={ChatRoomScreen}
                options={{
                  headerShown: true,
                }}
              />
            </Drawer.Navigator>
          </ChatsContext.Provider>
        </>
      )}
    </RegistrationContext.Provider>
  );
};

export default ScreenStackNavigation;
