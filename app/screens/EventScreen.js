import React, { useState, useRef } from "react";
import color from "../config/Colors";
import Header from "../models/header";
import GestureRecognizer from "react-native-swipe-gestures";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { setGlobalState, useGlobalState } from "../state";
import "../assets/i18n/i18n";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import Modal from "react-native-modal";
import { format, formatRelative, parseISO } from "date-fns";
import { en, sv } from "date-fns/locale";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Platform,
  Linking,
  FlatList,
  Animated,
  Pressable,
} from "react-native";

function EventScreen() {
  const { t, i18n } = useTranslation();

  const refCards = useRef(null);

  const navigation = useNavigation();
  const [api] = useGlobalState("api");
  const [currentIndex] = useGlobalState("currentIndex");
  const [state] = useGlobalState("initialMapState");

  const [isModalVisible, setIsModalVisible] = React.useState(false);
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

  const closeModal = () => {
    setIsModalVisible(() => false);
  };
  const showModal = (item) => {
    if (item !== undefined && !isModalVisible) {
      setCurrentEvent(item);
      setIsModalVisible(() => true);
    }
  };
  const { isLoading, error, data } = useQuery({
    queryKey: [currentIndex],
    queryFn: () =>
      fetch(api + "/api/list/?nation=" + state.cards[currentIndex].title).then(
        (res) => res.json()
      ),
  });

  useFocusEffect(
    React.useCallback(() => {
      refCards.current.scrollTo({
        x: currentIndex * Dimensions.get("window").width,
        y: 0,
        animated: false,
      });
    }, [currentIndex])
  );

  //Called when the "open in maps" button is pressed, opens maps with the marker's coordinates
  const openMaps = (latitude, longitude) => {
    const daddr = `${latitude},${longitude}`;
    const company = Platform.OS === "ios" ? "apple" : "google";
    Linking.openURL(`http://maps.${company}.com/maps?daddr=${daddr}`);
  };

  const onMomentumScrollEnd = ({ nativeEvent }) => {
    const index = Math.round(
      nativeEvent.contentOffset.x / Dimensions.get("window").width
    );
    if (index !== currentIndex) {
      setGlobalState("currentIndex", index);
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
    } catch (e) {
      console.log(e);
      return "";
    }
  }

  var dates = (int) => {
    let today = new Date();
    let nonNumeric = false;
    if (int[0] === "0") {
      int = int.substring(1);
    }
    if (int == today.getDate()) {
      int = t("today");
      nonNumeric = true;
    } else if (int == today.getDate() + 1) {
      int = t("tomorrow");
      nonNumeric = true;
    }
    return [int, nonNumeric];
  };

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
            <Text numberOfLines={2} style={styles.rubric}>
              {" "}
              {item.title.replace("  ", " ")}{" "}
            </Text>
            <Text numberOfLines={1} style={styles.text}>
              {" "}
              {capitalizer(eventDate(item.starttime)) /*ok*/}
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

  var _listEmptyComponent = () => {
    return (
      <View>
        <Text style={styles.loadingText}>{t("noEventFoundNation")}</Text>
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
              <Text numberOfLines={2} style={styles.rubric}>
                {" "}
                {currentEvent.title.replace("  ", " ")}{" "}
              </Text>
              <Text numberOfLines={1} style={styles.text}>
                {" "}
                {capitalizer(eventDate(currentEvent.starttime))}{" "}
                {eventTime(currentEvent.starttime)}
              </Text>
              <Text numberOfLines={1} style={styles.textBetween}>
                {" "}
                –{" "}
              </Text>
              <Text numberOfLines={1} style={styles.text}>
                {" "}
                {capitalizer(eventDate(currentEvent.endtime))}{" "}
                {eventTime(currentEvent.endtime)}
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
          <Animated.ScrollView
            ref={refCards}
            contentContainerStyle={styles.contentContainer}
            horizontal
            pagingEnabled
            scrollEnabled
            scrollEventThrottle={1000}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            contentOffset={{
              x: currentIndex * Dimensions.get("window").width,
              y: 0,
            }} //setting the starting scroll offset
            onMomentumScrollEnd={onMomentumScrollEnd}
          >
            {/*Creates scrollView cards with unique index; img, title from cardData*/}
            {state.cards.map((card, index) => (
              <GestureRecognizer
                key={"gesture" + index}
                onSwipeUp={() => navigation.navigate("MapScreen")}
              >
                <View style={styles.cardView} key={index}>
                  <Text style={styles.rubric}>{card.title}</Text>
                  <View style={styles.cardInfoContainer}>
                    <View style={styles.cardImgView}>
                      <Image
                        source={{ uri: card.image.uri }}
                        style={styles.cardImg}
                      />
                    </View>
                    <View style={styles.cardDescriptionView}>
                      <View style={styles.horizontalButtons}>
                        <Pressable
                          style={[styles.button]}
                          onPress={() =>
                            openMaps(
                              state.markers[index].coordinate.latitude,
                              state.markers[index].coordinate.longitude
                            )
                          }
                        >
                          <Ionicons
                            style={styles.facebookButton}
                            name="location-outline"
                            size={40}
                            color={color.NATIONSGUIDEN_RED}
                          />
                        </Pressable>
                        <Pressable
                          style={[styles.button]}
                          onPress={() =>
                            Linking.openURL(
                              "https://www.facebook.com/n/?" + card.facebook
                            )
                          }
                        >
                          <Ionicons
                            style={styles.facebookButton}
                            name="logo-facebook"
                            size={40}
                            color={color.FACEBOOK_BLUE}
                          />
                        </Pressable>
                      </View>
                      <Pressable
                        style={[styles.button]}
                        onPress={() => navigation.navigate("MapScreen")}
                      >
                        <Text style={styles.textButton}>{t("showMap")}</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </GestureRecognizer>
            ))}
          </Animated.ScrollView>
        </View>
      </View>
    </>
  );
}

export default EventScreen;

//Horizontal share of the screen that is for the top left logo
const topLeftHorizontalShare = 0.4;

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
    flex: 0.42,
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
  cardView: {
    elevation: 5,
    shadowColor: color.BLACK,
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    backgroundColor: color.WHITE,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: color.NATIONSGUIDEN_RED,
    width: Dimensions.get("window").width,
    height:
      Platform.OS === "android"
        ? 0.254 * Dimensions.get("window").height
        : 0.235 * Dimensions.get("window").height,
    overflow: "hidden",
    flex: 1,
    textAlign: "center",
  },
  cardImg: {
    height: "90%",
    width: "90%",
    resizeMode: "contain",
    alignSelf: "center",
    marginLeft: "5%",
  },
  cardImgView: {
    flex: 0.6,
    backgroundColor: color.WHITE,
    padding: 5,
    justifyContent: "center",
  },
  cardInfoContainer: {
    flex: 1,
    flexDirection: "row",
    marginBottom: "2%",
  },
  cardDescriptionView: {
    flex: 0.9,
    margin: 8,
    backgroundColor: color.WHITE,
    padding: 5,
    borderRadius: 10,
    shadowColor: color.BLACK,
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    elevation: 10,
    borderColor: color.NATIONSGUIDEN_RED,
    borderWidth: 3,
  },
  closeModal: {
    position: "absolute",
    height: 0.1 * Dimensions.get("window").width,
    alignSelf: "flex-end",
    marginTop: -2,
  },
  container: {
    flex: 0.93,
    backgroundColor: color.WHITE,
  },
  contentContainer: {
    flex: 1,
    position: "absolute",
  },
  description: {
    borderColor: color.NATIONSGUIDEN_RED_MODAL,
    borderWidth: 2,
    borderRadius: 10,
    margin: 10,
    padding: 4,
    minHeight: "35%",
  },

  eventWindow: {
    backgroundColor: color.WHITE,
    //width: Dimensions.get('window').width,
    flexGrow: 1,
    top: 0.01 * Dimensions.get("window").height,
    alignItems: "center",
  },
  eventIndividual: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: color.WHITE,
    width: 0.9 * Dimensions.get("window").width,
    height: 0.18 * Dimensions.get("window").height,
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
  eventTextContainer: {
    flex: 1,
    flexDirection: "column",
  },
  facebookButton: {
    alignSelf: "center",
  },
  horizontalButtons: {
    flex: 1,
    flexDirection: "row",
    //If two buttons, use 'space-around', if three buttons, use 'space-betweens'
    justifyContent: "space-around",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: color.NATIONSGUIDEN_RED,
    marginTop: "50%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  main: {
    flex: 1,
    backgroundColor: color.WHITE,
    alignItems: "center",
    justifyContent: "center",
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
  nationName: {
    flex: 0.33,
    backgroundColor: color.WHITE,
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
  rubricMain: {
    color: color.NATIONSGUIDEN_RED,
    fontSize: 20,
    fontFamily: "Raleway_700Bold",
    alignSelf: "center",
    textAlign: "center",
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
  topLeft: {
    backgroundColor: color.WHITE,
    flex: topLeftHorizontalShare,
    justifyContent: "flex-start",
    resizeMode: "contain",
  },
  topRight: {
    backgroundColor: color.WHITE,
    flex: 1 - topLeftHorizontalShare,
    justifyContent: "flex-end",
    paddingLeft: 10,
  },
  top: {
    flex: 0.25,
    flexDirection: "row",
    borderColor: color.NATIONSGUIDEN_RED,
    borderBottomWidth: 3,
    marginBottom: 10,
  },
  topLeft: {
    backgroundColor: color.WHITE,
    flex: topLeftHorizontalShare,
    justifyContent: "flex-start",
    resizeMode: "contain",
  },
  topRight: {
    backgroundColor: color.WHITE,
    flex: 1 - topLeftHorizontalShare,
    justifyContent: "flex-end",
    paddingLeft: 10,
  },
});
