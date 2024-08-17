import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DataShow from '../DataShow';
import Home from '../Home/Index';
const Stack = createNativeStackNavigator();

const Navgtion =()=>{
return(
    
   <NavigationContainer>
    <Stack.Navigator>
        <Stack.Screen name='DataShow' component={DataShow}/>
        <Stack.Screen name='Home' component={Home}/>
    </Stack.Navigator>
   </NavigationContainer>
    
)
}
export default Navgtion
