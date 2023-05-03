import {
  Raleway_400Regular,
  Raleway_600SemiBold,
  Raleway_700Bold,
} from "@expo-google-fonts/raleway";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as SQLite from "expo-sqlite";
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
  // db init and so on
  const db = SQLite.openDatabase("db.sqlite3");
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS Nation (id INTEGER PRIMARY KEY, name TEXT, description TEXT, facebook_link TEXT, site_link TEXT, latitude REAL, longitude REAL, address TEXT, logo TEXT, marker TEXT"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS Event (id INTEGER PRIMARY KEY, title TEXT, starttime TEXT, endtime TEXT, location TEXT, link TEXT, description TEXT, nation INTEGER, FOREIGN KEY(nation) REFERENCES nation(id)"
    );
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
