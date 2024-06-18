import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Go to MateUp Calendar"
          onPress={() => navigation.navigate('MateUpCalendar')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="QR code generator"
          onPress={() => navigation.navigate('QRGenerator')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="QR Scanner"
          onPress={() => navigation.navigate('ScannerQRcode')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Workout form"
          onPress={() => navigation.navigate('WorkoutForm')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginVertical: 10, // Adds vertical margin to each button
  },
});

export default HomeScreen;
