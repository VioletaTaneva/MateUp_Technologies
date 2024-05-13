// import React, { useState } from 'react';
// import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
// import { Agenda } from 'react-native-calendars';

// const AgendaScreen = () => {
//   const [items, setItems] = useState({});

//   const loadItems = (day) => {
//     setTimeout(() => {
//       for (let i = -15; i < 85; i++) {
//         const time = day.timestamp + i * 24 * 60 * 60 * 1000;
//         const strTime = timeToString(time);

//         if (!items[strTime]) {
//           items[strTime] = [];

//           const numItems = Math.floor(Math.random() * 3 + 1);
//           for (let j = 0; j < numItems; j++) {
//             items[strTime].push({
//               name: 'Item for ' + strTime + ' #' + j,
//               height: Math.max(50, Math.floor(Math.random() * 150)),
//               day: strTime,
//             });
//           }
//         }
//       }

//       setItems({ ...items });
//     }, 1000);
//   };

//   const renderItem = (reservation) => {
//     const fontSize = reservation.first ? 16 : 14;
//     const color = reservation.first ? 'black' : '#43515c';

//     return (
//       <TouchableOpacity
//         style={[styles.item, { height: reservation.height }]}
//         onPress={() => Alert.alert(reservation.name)}
//       >
//         <Text style={{ fontSize, color }}>{reservation.name}</Text>
//       </TouchableOpacity>
//     );
//   };

//   const renderEmptyDate = () => {
//     return (
//       <View style={styles.emptyDate}>
//         <Text>This is empty date!</Text>
//       </View>
//     );
//   };

//   const rowHasChanged = (r1, r2) => {
//     return r1.name !== r2.name;
//   };

//   const timeToString = (time) => {
//     const date = new Date(time);
//     return date.toISOString().split('T')[0];
//   };

//   return (
//     <Agenda
//       items={items}
//       loadItemsForMonth={loadItems}
//       selected={'2017-05-16'}
//       renderItem={renderItem}
//       renderEmptyDate={renderEmptyDate}
//       rowHasChanged={rowHasChanged}
//       showClosingKnob={true}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   item: {
//     backgroundColor: 'white',
//     flex: 1,
//     borderRadius: 5,
//     padding: 10,
//     marginRight: 10,
//     marginTop: 17,
//   },
//   emptyDate: {
//     height: 15,
//     flex: 1,
//     paddingTop: 30,
//   },
// });

// export default AgendaScreen;