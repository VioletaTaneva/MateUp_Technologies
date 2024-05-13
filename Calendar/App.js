import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import MateUpCalendar from './MateUpCalendar';
//import CalendarUsersAgenda from './CalendarUsersAgenda';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>Potatoland</Text>
      {/* <CalendarUsersAgenda/> */}
      <MateUpCalendar/> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
