import {
  Raleway_400Regular,
  Raleway_600SemiBold,
  Raleway_700Bold,
} from "@expo-google-fonts/raleway";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import Navigation from "./app/routes/tabNav";
import { useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  const { i18n } = useTranslation();
  const getLang = async () => {
    let lang = await AsyncStorage.getItem("lang");
    if (lang !== null) {
      i18n.changeLanguage(lang).catch((err) => console.log(err));
    } else {
      AsyncStorage.setItem("lang", i18n.language); //sets it to what it is now if it has not been set before
    }
  };
  const [fontsLoaded] = useFonts({
    //Regular Text
    Raleway_400Regular: Raleway_400Regular,
    //Headlines
    Raleway_600SemiBold: Raleway_600SemiBold,
    //Main headlines
    Raleway_700Bold: Raleway_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
      await getLang();
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <Navigation />
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
