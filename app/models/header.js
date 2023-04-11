import React from 'react';
import color from '../config/Colors';
import { useNavigation } from '@react-navigation/native';

import {
    StyleSheet,
    View,
    Image,
    StatusBar,
    SafeAreaView,
    TouchableWithoutFeedback
      } from 'react-native';



export default function Header() {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.Header}>
            <TouchableWithoutFeedback activeOpacity={1} style= {styles.topac}>
                <Image source={require("../assets/AppGeneral/Logo.png")} style={styles.headerImage}/>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    Header: {
        display: "flex",
        flex: 0.07,
        height: "100%",
        alignItems: "flex-start",
        paddingBottom: 5,
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: color.NATIONSGUIDEN_RED,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: color.WHITE,
    },
    headerImage: {
        resizeMode: "contain",
        height:"100%",
        width: "55%",
        marginLeft: 15,
    },
    topac: {
        flex: 1,
        height: "100%",
        width: "100%",
    }
})



