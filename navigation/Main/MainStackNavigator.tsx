import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { User, onAuthStateChanged } from "firebase/auth";
import { RegistrationContext } from "@/contexts/RegistrationContext";
import { auth } from "@/firebase/firebase.config";

import SplashScreen from "@/screens/OnBoarding/SplashScreen/SpashScreen";
import WelcomeScreen from "@/screens/OnBoarding/WelcomeScreen/WelcomeScreen";
import LoginScreen from "@/screens/Registration/AuthenticationScreen/LoginScreen/LoginScreen";
import PasswordVerifyScreen from "@/screens/Registration/AuthenticationScreen/PasswordScreen/PasswordVerifyScreen";

const Stack = createStackNavigator();

const MainStackNavigator: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loginFromGoogle, setLoginFromGoogle] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setEmail(user.email || "");
      }
    });

    setLoading(false);
    return unsubscribe;
  }, []);

  if (loading) {
    return null;
  }

  return (
    <RegistrationContext.Provider
      value={{
        user,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        email,
        setEmail,
        dateOfBirth,
        setDateOfBirth,
        username,
        setUsername,
        loginFromGoogle,
        setLoginFromGoogle,
      }}
    >
      <Stack.Navigator initialRouteName={user ? "Home" : "Onboarding"}>
        {user ? (
          <></>
        ) : (
          <>
            <Stack.Screen
              name="Onboarding"
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
              name="PasswordVerify"
              options={{ headerShown: false }}
              component={PasswordVerifyScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </RegistrationContext.Provider>
  );
};

export default MainStackNavigator;
