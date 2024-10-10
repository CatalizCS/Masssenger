import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
import { store } from "@/store/store";
import * as Linking from "expo-linking";
import * as SplashScreen from "expo-splash-screen";
import * as WebBrowser from "expo-web-browser";
import Toast from "react-native-toast-message";

import {
  useFonts,
  OpenSans_300Light,
  OpenSans_400Regular,
  OpenSans_700Bold,
} from "@expo-google-fonts/open-sans";
import { NavigationContainer } from "@react-navigation/native";
import MainStackNavigator from "@/navigation/Main/MainStackNavigator";
import { Provider } from "react-redux";

LogBox.ignoreAllLogs();

SplashScreen.preventAutoHideAsync();
WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const linking = {
    prefixes: [Linking.createURL("/")],
    config: {
      screens: {
        NotFound: "*",
      },
    },
  };

  const [fontsLoaded] = useFonts({
    OpenSans_300Light,
    OpenSans_400Regular,
    OpenSans_700Bold,
  });

  useEffect(() => {
    async function hideSplashScreen() {
      await SplashScreen.hideAsync();
    }

    hideSplashScreen();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Provider store={store}>
        <SafeAreaProvider>
          <NavigationContainer linking={linking} independent={true}>
            <MainStackNavigator />
          </NavigationContainer>

          <Toast />
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
