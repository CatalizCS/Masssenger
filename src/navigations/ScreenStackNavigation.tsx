import React, { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { getProfile } from "../firebase/Services/Profile";
import { Profile } from "@/src/types/Profile";
import { auth } from "@/src/firebase/firebase";

import { RegistrationContext } from "@/src/contexts/RegistrationContext";
import { ChatsContext } from "@/src/contexts/ChatsContext";

import Loading from "@/src/screens/Loading/Loading";
import SplashScreen from "@/src/screens/Onboarding/Welcome/SplashScreen";
import WelcomeScreen from "@/src/screens/Onboarding/Welcome/WelcomeScreen";
import LoginScreen from "@/src/screens/Onboarding/Login/loginScreen";
import RegisterScreen from "@/src/screens/Onboarding/Login/RegisterScreen";
import ForgotScreen from "@/src/screens/Onboarding/Login/ForgotScreen";

import { ChatsHeader } from "@/src/components/Header/Header";
import HomeScreen from "@/src/screens/Home/Chats/HomeScreen";
import DrawerContent from "@/src/components/Drawer/LeftMenu";
import ChatRoomScreen from "@/src/screens/Home/Chats/ChatRoom";
import NewAccountScreen from "@/src/screens/Onboarding/Infomation/NewAccount";
import StoriesScreen from "@/src/screens/Home/Stories/StoriesScreen";
import { Chat } from "@/src/types/Message";
import { Alert } from "react-native";
import StoriesHeader from "../components/Header/StoriesHeader";
import { Ionicons } from "@expo/vector-icons";
import * as Updates from "expo-updates";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: {
        backgroundColor: "#fff",
      },
      tabBarActiveTintColor: "#aa18ea",
      tabBarInactiveTintColor: "#333",
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        headerShown: true,
        header: () => <ChatsHeader />,
        tabBarIcon: ({ color }) => (
          <Ionicons name="home-outline" size={20} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Stories"
      component={StoriesScreen}
      options={{
        headerShown: true,
        header: () => <StoriesHeader />,
        tabBarIcon: ({ color }) => (
          <Ionicons name="book-outline" size={20} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const ScreenStackNavigation: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [Suggestions, setSuggestions] = useState<Chat[]>([]);

  const MainDrawer = () => (
    <Drawer.Navigator
      drawerContent={() => (
        <DrawerContent
          onMenuPress={() => {}}
          onLogout={() => {
            Alert.alert(
              "Logout",
              "Are you sure you want to logout?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Logout",
                  onPress: async () => {
                    try {
                      await signOut(auth);
                      setUserInfo(null);
                      setUser(null);

                      Updates.reloadAsync();
                      // reset the app
                    } catch (error) {
                      console.error("Failed to logout:", error);
                    }
                  },
                },
              ],
              { cancelable: true }
            );
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
      <Drawer.Screen name="MainTabs" component={MainTabs} />
      <Drawer.Screen name="ChatRoom" component={ChatRoomScreen} />
    </Drawer.Navigator>
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const profile = await getProfile(user.uid);
        if (profile) {
          setUserInfo(profile);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer independent={true}>
      <RegistrationContext.Provider
        value={{ user, setUser, userInfo, setUserInfo }}
      >
        <ChatsContext.Provider
          value={{ Suggestions, setSuggestions, chatList, setChatList }}
        >
          {!user ? (
            <Stack.Navigator initialRouteName="Splash">
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
            </Stack.Navigator>
          ) : (
            <Stack.Navigator>
              {!userInfo ? (
                <Stack.Screen
                  name="Infomation"
                  component={NewAccountScreen}
                  options={{ headerShown: false }}
                />
              ) : (
                <Stack.Screen
                  name="Main"
                  component={MainDrawer}
                  options={{ headerShown: false }}
                />
              )}
            </Stack.Navigator>
          )}
        </ChatsContext.Provider>
      </RegistrationContext.Provider>
    </NavigationContainer>
  );
};

export default ScreenStackNavigation;
