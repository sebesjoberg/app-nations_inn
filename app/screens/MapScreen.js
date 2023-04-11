import MapView from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import GestureRecognizer from "react-native-swipe-gestures";
import { setGlobalState, useGlobalState } from "../state";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  Dimensions,
  Pressable,
  Animated,
  Linking,
} from "react-native";

import React, { useRef, useEffect } from "react";
import color from "../config/Colors";
import Header from "../models/header";
import "../assets/i18n/i18n";
import { useTranslation } from "react-i18next";

function MapScreen() {
  const [currentIndex] = useGlobalState("currentIndex"); //global state contains index
  const [state] = useGlobalState("initialMapState"); //^ contains markers,cards,initialregion

  const resetMap = () => {
    //resets map to initalstate aswell as currentIndex
    setIndex(0);
    refMap.current?.animateToRegion(state.region);
    refCards.current.scrollTo({
      x: 0 * Dimensions.get("window").width,
      y: 0,
      animated: true,
    });
  };

  // Using nativeEvent, an animation requires a value by default
  let markerAnimation = new Animated.Value(0);

  const interpolations = state.cards.map((card, index) => {
    //handles the scaling of markers
    const inputRange = [
      (index - 1) * Dimensions.get("window").width,
      index * Dimensions.get("window").width,
      (index + 1) * Dimensions.get("window").width,
    ];

    const scale = markerAnimation.interpolate({
      inputRange, //card index/positions [before, present, after]

      outputRange: [1, 1.5, 1], //scales the marker [before, present, after]

      extrapolate: "clamp",
    });

    return { scale };
  });

  const onMarkerPress = (mapEventData) => {
    // Called when a marker is pressed sets new index and scrolls to index
    const index = mapEventData._targetInst.return.key;
    let x = index * Dimensions.get("window").width;
    setIndex(index);
    refCards.current.scrollTo({ x: x, y: 0, animated: true });
  };

  // Creates a reference object for the Mapview and ScrollView where the markers and cards are set
  const refMap = useRef(null);
  const refCards = useRef(null);

  //Multiple language support
  const { t, i18n } = useTranslation();

  //Called when the "open in maps" button is pressed, opens maps with the marker's coordinates
  const openMaps = (title) => {
    const coordinates = getCoordsFromName(title);
    const daddr = `${coordinates[0]},${coordinates[1]}`;
    const company = Platform.OS === "ios" ? "apple" : "google";
    Linking.openURL(`http://maps.${company}.com/maps?daddr=${daddr}`);
  };

  //Returs the coords for the nation
  const getCoordsFromName = (name) => {
    const marker = state.markers.find((marker) => marker.title === name);
    const latitude = marker.coordinate.latitude;
    const longitude = marker.coordinate.longitude;
    return [latitude, longitude];
  };
  //Used for navigating between map/event screen
  const navigation = useNavigation();

  function setIndex(index) {
    //Sets global index
    setGlobalState("currentIndex", index);
  }
  const onScroll = (e) => {
    // Called when scrolling gets offset and animates
    const x = e.nativeEvent.contentOffset.x;
    markerAnimation.setValue(x);
  };

  function onMomentumScrollEnd(e) {
    // Called when scrolling ends calulates index sets it globally
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / Dimensions.get("window").width);

    if (index !== currentIndex) {
      setIndex(index);
    }
  }
  useEffect(() => {
    //scrolls back without animation when currentIndex is changed to handle react autorerender
    //And scrolls if value is changed in eventscreen
    refCards.current.scrollTo({
      x: currentIndex * Dimensions.get("window").width,
      y: 0,
      animated: false,
    });
  }, [currentIndex]);

  return (
    <>
      <Header />
      <View style={styles.container}>
        <View style={styles.middle}>
          <MapView
            ref={refMap}
            style={styles.map}
            initialRegion={state.region}
            scrollEnabled={true}
            zoomEnabled={true}
            zoomTapEnabled={false}
            rotateEnabled={true}
            showsPointsOfInterest={false}
            moveOnMarkerPress={false} // android only
            minZoomLevel={13}
            maxZoomLevel={16}
            provider="google"
            onMapReady={resetMap}
          >
            {state.markers.map((marker, index) => {
              //creates all markers on map
              const scaleStyle = {
                // Uses the scaling above to scale markers
                transform: [
                  {
                    scale: interpolations[index].scale,
                  },
                ],
              };
              return (
                <MapView.Marker
                  key={index}
                  coordinate={marker.coordinate}
                  onPress={onMarkerPress}
                >
                  <Animated.View style={styles.markerWrap}>
                    <Animated.Image
                      source={marker.image}
                      style={[styles.marker, scaleStyle]} // adding the scaleStyle to the marker img (which is the marker)
                    ></Animated.Image>
                  </Animated.View>
                </MapView.Marker>
              );
            })}
          </MapView>
          <View
            style={styles.reloadMapButton} /*This creates the reload button*/
          >
            <Pressable onPress={resetMap} style={styles.mapButton}>
              <Ionicons
                onPress={resetMap}
                style={styles.facebookButton}
                name="refresh-circle"
                size={50}
                color={color.NATIONSGUIDEN_RED}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.bottom} /*This handles the cards on the bottom*/>
          <Animated.ScrollView
            ref={refCards}
            contentContainerStyle={styles.contentContainer}
            horizontal
            pagingEnabled
            scrollEnabled
            scrollEventThrottle={10} //Higher value=less firing = less strain on phone
            contentOffset={{ x: 0 * Dimensions.get("window").width, y: 0 }} //setting the starting scroll offset
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            onMomentumScrollEnd={onMomentumScrollEnd}
            onScroll={onScroll}
          >
            {state.cards.map((card, index) => (
              //This creates all the cards that can be scrolled trough
              <GestureRecognizer
                //handles up swipe and navigates
                key={"gesture" + index}
                onSwipeUp={() => navigation.navigate("EventScreen")}
              >
                <View style={styles.cardView} key={index}>
                  <Text style={styles.rubric}>{card.title}</Text>
                  <View style={styles.cardInfoContainer}>
                    <View style={styles.cardImgView}>
                      <Image source={card.image} style={styles.cardImg} />
                    </View>
                    <View style={styles.cardDescriptionView}>
                      <View style={styles.horizontalButtons}>
                        <Pressable
                          style={[styles.button]}
                          onPress={() => openMaps(card.title)}
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
                        onPress={() => navigation.navigate("EventScreen")}
                      >
                        <Text numberOfLines={1} style={styles.text}>
                          {t("showEvents")}
                        </Text>
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

export default MapScreen;
//All styles used
const styles = StyleSheet.create({
  bottom: {
    flex: 0.42,
  },
  button: {
    backgroundColor: color.WHITE,
    alignSelf: "center",
    maxWidth: "90%",
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
  container: {
    flex: 0.93,
    backgroundColor: color.WHITE,
  },
  contentContainer: {
    flex: 1,
    position: "absolute",
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
  image: {
    height: 80,
    width: 120,
  },
  loadingText: {
    fontSize: 20,
    color: color.NATIONSGUIDEN_RED,
    marginTop: "50%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 2,
    flex: 1,
  },
  mapButton: {
    alignSelf: "center",
  },
  marker: {
    height: 40,
    width: 40,
    //resizemode was previously 'cover'
    resizeMode: "stretch",
  },
  markerWrap: {
    justifyContent: Platform.OS === "android" ? "flex-end" : "flex-start",
    //justifyContent: 'center',
    height: 40,
    width: 40,
    //debugging color
    //backgroundColor: color.SNERKES_GOLD,
  },
  middle: {
    flex: 1,
    backgroundColor: color.VDALA_BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  natImg: {
    resizeMode: "contain",
    alignSelf: "center",
    height: "57%",
  },
  reloadMapButton: {
    position: "absolute", //use absolute position to show button on top of the map
    top: "87%", //for center align
    alignSelf: "flex-end", //for align to right
  },
  rubric: {
    color: color.NATIONSGUIDEN_RED,
    fontSize: 20,
    fontFamily: "Raleway_600SemiBold",
    alignSelf: "center",
  },
  text: {
    color: color.NATIONSGUIDEN_RED,
    fontSize: 18,
    fontFamily: "Raleway_400Regular",
    padding: 10,
    alignSelf: "center",
    textAlign: "center",
  },
  top: {
    flex: 0.1,
    flexDirection: "row",
  },
  topLeft: {
    flex: 0.8,
    backgroundColor: color.WHITE,
    justifyContent: "flex-end",
  },
  topRight: {
    flex: 0.2,
    backgroundColor: color.NATIONSGUIDEN_TURQUOISE,
    justifyContent: "flex-start",
  },
});
