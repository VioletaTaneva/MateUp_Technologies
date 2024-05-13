import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import CalendarPicker from "react-native-calendar-picker";

export default class MateUpCalendar extends Component {
  // Constructor for the calendar component
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null,
      currentlySelectedDate: [],
    };
  }

  // Method for the calendar component to update the selected date
  onDateChange = (date) => {
    this.setState({
      selectedStartDate: date,
      currentlySelectedDate: date ? date.toString().split(" ") : [],
    });
  };

  // Creating the event details
  dummyEvents = [
    {
      date: 15,
      month: "May",
      year: 2024,
      time: "10:00 AM",
      title: "Meeting with Team",
      description: "Discuss project updates and next steps."
    },
    {
      date: 20,
      month: "June",
      year: 2024,
      time: "2:30 PM",
      title: "Conference Call",
      description: "Call with stakeholders to review project milestones."
    },
    {
      date: 5,
      month: "July",
      year: 2024,
      time: "9:00 AM",
      title: "Training Session",
      description: "Training session for new software release."
    }
  ];
  

  render() {
    // Get the selected date from the state and convert it to a string
    const { selectedStartDate, currentlySelectedDate } = this.state;
    const startDate = selectedStartDate ? selectedStartDate.toString() : "";

    // Create an object with the selected date's day of week, month, date, and year
    let backend = {
      dayOfWeek: currentlySelectedDate[0] || "",
      month: currentlySelectedDate[1] || "",
      date: currentlySelectedDate[2] || "",
      year: currentlySelectedDate[3] || "",
    };

    console.log(currentlySelectedDate);
    console.log(backend);

    // Render the selected date and event details
    return (
      <View style={styles.container}>
        {/* Set the selected date and event details in the state */}
        <CalendarPicker
          onDateChange={this.onDateChange}
          startFromMonday={true}
        />

        {/* Render the selected date and event details */}
        <View style={styles.selectedDateContainer}>
          <Text style={styles.selectedDateText}>
            {`${backend.date}/${backend.month}/${backend.year} - Selected`}
          </Text>
        </View>
      </View>
    );
  }
}

// Stylesheet for the calendar component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginTop: 100,
  },
});














// import React, { Component } from "react";
// import { StyleSheet, Text, View, FlatList } from "react-native";
// import CalendarPicker from "react-native-calendar-picker";
// import moment from "moment";

// export default class MateUpCalendar extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       selectedStartDate: null,
//       selectedEvent: null,
//       events: [
//         {
//           date: "2024-05-19",
//           title: "Event 1",
//           description: "Description 1",
//         },

//         {
//           date: "2024-05-20",
//           title: "Event 2",
//           description: "Description 2",
//         },
//         {
//           date: "2024-05-21",
//           title: "Event 3",
//           description: "Description 3",
//         },
//       ],
//     };
//   }

//   onDateChange = (date) => {
//     const clickedDate = moment(date).format("YYYY-MM-DD");
//     const selectedEvent = this.state.events.find(
//       (event) => event.date === clickedDate
//     );

//     this.setState({
//       selectedStartDate: date,
//       selectedEvent: selectedEvent,
//     });
//   };

//   renderEventDetails = () => {
//     const { selectedEvent } = this.state;
//     if (selectedEvent) {
//       return (
//         <View>
//           <Text>SELECTED EVENT:</Text>
//           <Text>Date: {selectedEvent.date}</Text>
//           <Text>Title: {selectedEvent.title}</Text>
//           <Text>Description: {selectedEvent.description}</Text>
//         </View>
//       );
//     }
//     return null;
//   };

//   render() {
//     const { selectedStartDate, events } = this.state;
//     const startDate = selectedStartDate ? selectedStartDate.toString() : "";
//     const sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date));
//     return (
//       <View style={styles.container}>
//         <CalendarPicker
//           onDateChange={this.onDateChange}
//           startFromMonday={true}
//         />
//         <View>
//           <Text>SELECTED DATE: {startDate}</Text>
//           {this.renderEventDetails()}
//         </View>
//         <View style={styles.eventsContainer}>
//           <FlatList
//             data={sortedEvents}
//             renderItem={({ item }) => (
//               <View style={styles.event}>
//                 <Text style={styles.date}>{item.date}</Text>
//                 <Text style={styles.title}>{item.title}</Text>
//                 <Text style={styles.description}>{item.description}</Text>
//               </View>
//             )}
//             keyExtractor={(item) => item.date}
//           />
//         </View>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     marginTop: 100,
//   },
//   eventsContainer: {
//     marginTop: 20,
//     paddingHorizontal: 20,
//   },
//   event: {
//     marginBottom: 10,
//     padding: 10,
//     backgroundColor: "#F2F2F2",
//     borderRadius: 5,
//   },
//   date: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   title: {
//     marginTop: 5,
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   description: {
//     marginTop: 5,
//     fontSize: 12,
//   },
// });
