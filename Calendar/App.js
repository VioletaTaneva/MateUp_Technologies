import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


// Import your screen components
import HomeScreen from './HomeScreen';
import MateUpCalendar from './MateUpCalendar'; 
import QRGenerator from './QRGenerator';  
import ScannerQRcode from './ScanerQRCode';
import WorkoutForm from './WorkoutForm';
 


const Stack = createNativeStackNavigator();

export default function App() {
  return (

    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MateUpCalendar" component={MateUpCalendar} />
        <Stack.Screen name="QRGenerator" component={QRGenerator} /> 
        <Stack.Screen name="ScannerQRcode" component={ScannerQRcode} />
        <Stack.Screen name="WorkoutForm" component={WorkoutForm}/>
      </Stack.Navigator>

    </NavigationContainer>
  );
}
