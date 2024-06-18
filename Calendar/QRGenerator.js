import React from 'react';
import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';



const QRGenerator = () => {
  return (
    <View style={styles.container}>
      <QRCode value='https://www.basic-fit.com/nl-be/home'  />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default QRGenerator;
