import React, { useState } from "react";
import color from '../config/Colors';
import Header from "../models/header";
import '../assets/i18n/i18n';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
    } from 'react-native';


export default function SettingScreen(){
//fixsothispersists
    const onPressSvenska = () => changeLanguage('sv')
    const onPressEnglish = () => changeLanguage('en')

    

    const {t, i18n} = useTranslation();
    
    const [currentLanguage,setLanguage] =useState('en');

    const changeLanguage = value => {
        AsyncStorage.setItem('lang',value)
    i18n
        .changeLanguage(value)
        .then(() => setLanguage(value))
        .catch(err => console.log(err));
    };
   

    



    return(
        <><Header/>
        <View style={styles.container}>
            <View style={styles.settings}>
                <Text style={styles.settingsText}>{t("settings")}</Text>
                <View style={styles.language}>
                    <Text style={styles.selectLanguageText} fontSize={10}>{t('selectLanguage')}</Text>
                    <View style={styles.languageIcons}>
                        <TouchableOpacity onPress={onPressSvenska} style={styles.flag_SWE}>
                            <Image source={require("../assets/AppGeneral/swedenflagnew.jpg")} style={styles.flag_SWE} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onPressEnglish} style={styles.flag_UK}>
                            <Image source={require("../assets/AppGeneral/UK_flag.png")} style={styles.flag_UK} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View></>
);
}


const styles = StyleSheet.create({
    
    top: {
        flex: 0.1,
        flexDirection: "row",
    },
    
   
    backButton: {
        flex: 0.2,
        paddingTop: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    backImage: {
        width: "70%",
        height: "70%",
    },
    Button: {
        backgroundColor: "white",
        borderWidth: 3,
        borderRadius: 15,
        borderColor: color.NATIONSGUIDEN_RED,
        padding: 5,
    },
    ButtonText: {
        fontSize: 20,
        fontWeight: "bold",
        color: color.BLACK,
        fontFamily: 'Raleway_400Regular',
    },
    ButtonStyle: {
        padding: 10,
    },
    container: {
        flex: 0.93,   
        backgroundColor: color.WHITE,
    },
    language: {
        flexDirection: "column",
        marginTop: 10,
        alignContent: "center",
        justifyContent: "center",
        alignSelf: "center",
    },
    languageIcons: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        alignSelf: "center",
        marginLeft: -15,
    },
    logoImage: {
        flex: 0.8,
        width: "70%",
        height: "60%",
    },
    orText: {
        fontSize: 15,
        fontFamily: 'Raleway_400Regular',
    },
    settings: {
        backgroundColor: color.WHITE,
        flex: 0.5,
    },
    settingsText: {
        color: color.NATIONSGUIDEN_RED,
        fontFamily: 'Raleway_700Bold',
        fontWeight: "bold",
        fontSize: 22,
        padding: 10,
        alignSelf: "center",
    },
    selectLanguageText: {
        color: color.NATIONSGUIDEN_RED,
        fontFamily: 'Raleway_400Regular', 
        fontSize: 20,
        padding: 5,
    },
    flag_SWE: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginLeft: 3,       
    },
    flag_UK: {
        width: 50,
        height: 50,
        borderRadius: 50,  
        marginLeft: 10,
    },
    textView:{
        marginBottom: 20,
        flexDirection: "row",
        
    },
    textLogged:{
        fontFamily: 'Raleway_400Regular', 
        fontSize: 23,
        color: color.NATIONSGUIDEN_RED,
        fontWeight: "bold",
        marginRight:5,
        
    },
    textUsername:{
        fontFamily: 'Raleway_400Regular', 
        fontSize: 23,
        color: color.NATIONSGUIDEN_RED,
        marginLeft: 5,
    }

})