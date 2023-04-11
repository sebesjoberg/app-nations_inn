// import liraries
// import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {useNavigation} from '@react-navigation/native-stack';


const navigation = useNavigation;
// define your styles
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});


// create a component
const Footer = ({navigation}) => {

    return (
    
      <View style={styles.container}>
        <TouchableOpacity onPress={() => console.log(navigation)} title="Login" style={{width: 51, height: 51}} >
          <Image source={require("../assets/AppGeneral/profile_settings.png")}style={{width: 51, height: 51}}/>
        </TouchableOpacity>
        <Text>Hyderabad</Text>
      </View>
    );

}

//make this component available to the app
export default Footer;