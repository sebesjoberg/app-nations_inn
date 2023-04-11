import { NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import MapScreen from '../screens/MapScreen';
import SettingScreen from '../screens/SettingScreen';
import EventScreen from '../screens/EventScreen';
import DateScreen from '../screens/DateScreen';

import color from '../config/Colors';
import { Ionicons } from '@expo/vector-icons';



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
function Nav () {

  return (
  
      <Stack.Navigator initialRouteName="SettingScreen"
      screenOptions={{headerShown: false, animation: 'none' }}
      
      >
          <Stack.Screen name="MapScreen" component={MapScreen} />
          
          <Stack.Screen name="SettingScreen" component={SettingScreen}/>
          <Stack.Screen name="EventScreen" component={EventScreen} />
      </Stack.Navigator>

  )
}

function MapsEvents () {

  return (
  
      <Stack.Navigator initialRouteName="MapScreen"
      screenOptions={{headerShown: false, animation: 'none' }}
      
      >
          <Stack.Screen name="MapScreen" component={MapScreen} />
          <Stack.Screen name="EventScreen" component={EventScreen} />
      </Stack.Navigator>

  )
}



function tabNav() {
   
    
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'MapsEvents') {
                iconName = 'map';
              }
              else if (route.name === 'DateScreen') {
                iconName = 'list-outline';
              }
              else if (route.name === 'Nav') {
                iconName =  'settings';
              }
          
              // You can return any component that you like here!
              return <Ionicons name={iconName} size={20} color={color} />;
            },
            tabBarLabel: '',
            headerShown: false,
            tabBarActiveBackgroundColor: color.WHITE,
            tabBarInactiveBackgroundColor: color.NATIONSGUIDEN_RED,
            tabBarActiveTintColor: color.NATIONSGUIDEN_RED,

            tabBarInactiveTintColor: color.WHITE
          }/*)*/)}

            >
            <Tab.Screen name="MapsEvents" component={MapsEvents} />
            <Tab.Screen name="DateScreen" component={DateScreen} />
            <Tab.Screen name="Nav" component={Nav} />
        </Tab.Navigator>
    </NavigationContainer>
    )
}




export default tabNav;



const styles = StyleSheet.create({
})

// const styles = options.create({
//     bottomTab: {
//         options
//     }

// });
