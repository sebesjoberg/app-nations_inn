import React, { useState, useEffect } from "react";
import color from "../config/Colors";
import Header from "../models/header";
import { format, formatRelative, parseISO } from "date-fns";
import { en, sv } from "date-fns/locale";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { setGlobalState, useGlobalState } from "../state";
import "../assets/i18n/i18n";
import { useTranslation } from "react-i18next";

import Modal from "react-native-modal";

import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
  FlatList,
  Pressable,
} from "react-native";

function DateScreen() {
  const { t, i18n } = useTranslation();
  const [api] = useGlobalState("api");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysAhead, setDaysAhead] = useState(0);
  const [currentEvent, setCurrentEvent] = React.useState({
    description: "",
    endtime: "",
    id: 1,
    link: "",
    location: "",
    nation: "",
    starttime: "",
    title: "",
    logo: "",
  });

  const { isLoading, error, data } = useQuery({
    queryKey: [currentDate.toLocaleDateString().split("T")[0]],
    queryFn: () =>
      fetch(
        api +
          "/api/list/?starttime=" +
          currentDate.toLocaleDateString().split("T")[0]
      ).then((res) => res.json()),
  });
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const closeModal = () => {
    setIsModalVisible(() => false);
  };
  const showModal = (item) => {
    if (item !== undefined && !isModalVisible) {
      setCurrentEvent(item);
      setIsModalVisible(() => true);
    }
  };

  var renderLink = () => {
    if (currentEvent.link.includes("facebook")) {
      return (
        <Pressable
          style={[styles.button]}
          onPress={() => Linking.openURL(currentEvent.link)}
        >
          <Ionicons
            style={styles.facebookButton}
            name="logo-facebook"
            size={40}
            color={color.FACEBOOK_BLUE}
          />
        </Pressable>
      );
    } else if (currentEvent.link.includes("nationsguiden")) {
      return (
        <Pressable
          style={[styles.button]}
          onPress={() => Linking.openURL(currentEvent.link)}
        >
          <Image
            style={styles.natguiImg}
            source={{
              uri: "https://nationsguiden.se/mind_content/favicon/natgui.ico?m=201209102744",
            }}
          />
        </Pressable>
      );
    } else {
      return <Text>Error loading link</Text>;
    }
  };

  const nextDate = () => {
    let date = new Date();
    date.setDate(date.getDate() + daysAhead + 1);
    setDaysAhead(daysAhead + 1);
    setCurrentDate(date);
  };
  const previousDate = () => {
    let today = new Date();
    if (daysAhead > -1) {
      today.setDate(today.getDate() + daysAhead - 1);
      setDaysAhead(daysAhead - 1);
      setCurrentDate(today);
    }
  };
  function capitalizer(string) {
    if (string) {
      const arr = string.split(" ");
      for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
      }

      string = arr.join(" ");

      return string;
    }
    return "";
  }
  function eventTime(date) {
    return date.slice(11, 16);
  }
  function eventDate(date) {
    try {
      let eventTry = new Date(parseISO(date));
      if (isNaN(eventTry)) {
        eventTry = new Date(date);
      }
      const event = eventTry;
      const today = new Date();
      const options = "EEE d LLL";

      var nextWeek = Date.parse(
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)
      );

      if (nextWeek > Date.parse(event)) {
        if (i18n.language == "sv") {
          return formatRelative(event, today, {
            locale: sv,
          }).slice(0, -10);
        }
        if (i18n.language == "en") {
          return formatRelative(event, today, {
            locale: en,
          }).slice(0, -11);
        }
      } else {
        if (i18n.language == "sv") {
          //do parse ISO?
          return format(event, options, { locale: sv });
        }
        if (i18n.language == "en") {
          return format(event, options, { locale: en });
        }
      }
    } catch {
      return "hi";
    }
  }

  const renderData = (item) => {
    return (
      <View style={styles.eventIndividual}>
        <Pressable
          style={styles.pressableEvent}
          key={"Pressable" + item}
          onPress={() => showModal(item)}
        >
          <View style={styles.eventImageListContainer}>
            <Image
              source={{ uri: item.logo }}
              style={styles.eventImageList}
            ></Image>
          </View>
          <View style={styles.eventTextContainer}>
            <Text numberOfLines={2} style={styles.rubricFlatList}>
              {" "}
              {item.title.replace("  ", " ")}{" "}
            </Text>
            <Text numberOfLines={1} style={styles.text}>
              {" "}
              {capitalizer(eventDate(item.starttime))}{" "}
            </Text>
            <Text numberOfLines={1} style={styles.text}>
              {" "}
              {eventTime(item.starttime)}-{eventTime(item.endtime)}
            </Text>
          </View>
        </Pressable>
      </View>
    );
  };

  var _listEmptyComponent = () => {
    return (
      <View>
        <Text style={styles.loadingText}>{t("noEventFoundDate")}</Text>
      </View>
    );
  };

  return (
    <>
      <Header />
      <View style={styles.container}>
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => {
            closeModal();
          }}
        >
          <View style={styles.modalView}>
            <Image
              source={{ uri: currentEvent.logo }}
              style={styles.backgroundImage}
            ></Image>
            <Ionicons
              style={styles.closeModal}
              name="ios-close-circle"
              size={0.1 * Dimensions.get("window").width}
              color={color.ÖG_RED}
              onPress={() => {
                closeModal();
              }}
            />
            <View style={styles.eventTextContainer}>
              <Text numberOfLines={1} style={styles.rubric}>
                {" "}
                {currentEvent.title.replace("  ", " ")}{" "}
              </Text>
              <Text numberOfLines={1} style={styles.text}>
                {" "}
                {currentEvent.nation}{" "}
              </Text>
              <Text numberOfLines={1} style={styles.text}>
                {" "}
                {capitalizer(eventDate(currentEvent.starttime))}{" "}
                {currentEvent.starttime.slice(11, 16)}
              </Text>
              <Text numberOfLines={1} style={styles.textBetween}>
                {" "}
                –{" "}
              </Text>
              <Text numberOfLines={1} style={styles.text}>
                {" "}
                {capitalizer(eventDate(currentEvent.endtime))}{" "}
                {currentEvent.endtime.slice(11, 16)}
              </Text>
              <View style={styles.description}>
                <Text numberOfLines={5} style={styles.textTiny}>
                  {" "}
                  {currentEvent.description}{" "}
                </Text>
              </View>
              <View style={styles.openHours}>{renderLink()}</View>
            </View>
          </View>
        </Modal>
        <View style={{ flex: 1 }}>
          <FlatList
            contentContainerStyle={styles.eventWindow}
            data={data}
            renderItem={({ item }) => {
              return renderData(item);
            }}
            keyExtractor={(item) => `${item.id}`}
            ListEmptyComponent={_listEmptyComponent}
          ></FlatList>
        </View>
        <View style={styles.bottom}>
          <View style={styles.dateNavigator}>
            <TouchableOpacity
              style={styles.buttonLeft}
              onPress={() => {
                previousDate(currentDate);
              }}
            >
              <Ionicons
                style={styles.facebookButton}
                name="chevron-back-outline"
                size={40}
                color={color.NATIONSGUIDEN_RED}
              />
            </TouchableOpacity>
            <View style={styles.navigatorDate}>
              <Text style={styles.text}>
                {capitalizer(eventDate(currentDate))}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.buttonRight}
              onPress={() => {
                nextDate(currentDate);
              }}
            >
              <Ionicons
                style={styles.facebookButton}
                name="chevron-forward-outline"
                size={40}
                color={color.NATIONSGUIDEN_RED}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

export default DateScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignSelf: "center",
    resizeMode: "contain",
    opacity: 0.1,
    position: "absolute",
    marginLeft: 4,
  },
  bottom: {
    height: 0.2 * Dimensions.get("window").width,
  },
  button: {
    backgroundColor: color.WHITE,
    alignSelf: "center",
    maxWidth: "80%",
    borderRadius: 10,
    elevation: 5,
    shadowColor: color.BLACK,
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    marginBottom: 10,
    borderColor: color.NATIONSGUIDEN_RED,
    borderWidth: 0,
  },
  buttonLeft: {
    flex: 1,
    width: 0.2 * Dimensions.get("window").width,
    borderRightWidth: 2,
    borderColor: color.NATIONSGUIDEN_RED,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonRight: {
    flex: 1,
    width: 0.2 * Dimensions.get("window").width,
    borderLeftWidth: 2,
    borderColor: color.NATIONSGUIDEN_RED,
    justifyContent: "center",
    alignItems: "center",
  },
  closeModal: {
    position: "absolute",
    height: 0.1 * Dimensions.get("window").width,
    alignSelf: "flex-end",
    marginTop: -2,
  },
  container: {
    flex: 0.93,
  },
  dateNavigator: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 2,
    borderColor: color.NATIONSGUIDEN_RED,
  },
  description: {
    borderColor: color.NATIONSGUIDEN_RED_MODAL,
    borderWidth: 2,
    borderRadius: 10,
    margin: 10,
    padding: 4,
    minHeight: "35%",
  },
  eventImageListContainer: {
    flex: 0.45,
  },
  eventImageList: {
    flex: 1,
    height: "100%",
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    resizeMode: "contain",
  },
  eventIndividual: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: color.WHITE,
    width: 0.9 * Dimensions.get("window").width,
    height: 0.16 * Dimensions.get("window").height,
    margin: 0.01 * Dimensions.get("window").height,
    alignItems: "flex-start",
    justifyContent: "center",
    borderRadius: 0.02 * Dimensions.get("window").height,
    bottom: 0.01 * Dimensions.get("window").height,
    shadowColor: color.BLACK,
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    elevation: 10,
    borderColor: color.NATIONSGUIDEN_RED,
    borderWidth: 3,
  },
  eventTextContainer: {
    flex: 1,
    flexDirection: "column",
  },
  eventWindow: {
    backgroundColor: color.WHITE,
    flexGrow: 1,
    paddingTop: 0.01 * Dimensions.get("window").height,
    alignItems: "center",
  },
  facebookButton: {
    alignSelf: "center",
  },
  loadingText: {
    fontSize: 16,
    color: color.NATIONSGUIDEN_RED,
    marginTop: "50%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  modalView: {
    flex: 0.42,
    margin: 8,
    backgroundColor: color.WHITE,
    padding: 5,
    borderRadius: 20,
    borderColor: color.NATIONSGUIDEN_RED,
    borderWidth: 3,
  },
  natguiImg: {
    resizeMode: "contain",
    alignSelf: "center",
    height: 32,
    width: 32,
    margin: 6,
  },
  natguiImgContainer: {
    flex: 0.5,
    alignContent: "center",
    alignSelf: "center",
  },
  navigatorDate: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pressableEvent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rubric: {
    color: color.NATIONSGUIDEN_RED,
    fontSize: 20,
    fontFamily: "Raleway_600SemiBold",
    alignSelf: "center",
    textAlign: "center",
  },
  rubricFlatList: {
    color: color.NATIONSGUIDEN_RED,
    fontSize: 20,
    fontFamily: "Raleway_600SemiBold",
    alignSelf: "center",
    textAlign: "center",
    marginTop: -6,
  },
  text: {
    color: color.NATIONSGUIDEN_RED,
    fontSize: 18,
    fontFamily: "Raleway_400Regular",
    alignSelf: "center",
    textAlign: "center",
  },
  textBetween: {
    color: color.NATIONSGUIDEN_RED,
    fontSize: 18,
    marginTop: -4,
    marginBottom: -12,
    alignSelf: "center",
  },
  textButton: {
    color: color.NATIONSGUIDEN_RED,
    fontSize: 18,
    fontFamily: "Raleway_400Regular",
    padding: 10,
    alignSelf: "center",
    textAlign: "center",
  },
  textTiny: {
    color: color.NATIONSGUIDEN_RED,
    fontSize: 14,
    fontFamily: "Raleway_400Regular",
    flexDirection: "column",
  },
});
