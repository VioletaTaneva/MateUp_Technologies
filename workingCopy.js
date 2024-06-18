import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import MateUpCalendar from './MateUpCalendar';
import QRCode from 'react-native-qrcode-svg';


export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
     {/* <Text>Potatoland</Text> */}
       {/*<QRCode value='https://www.basic-fit.com/nl-be/home' 
     />*/}

     <MateUpCalendar />
      
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













import React, { Component } from "react";
import {StyleSheet,Text, View, Button, TextInput, Modal, TouchableOpacity, ScrollView,
} from "react-native";
import CalendarPicker from "react-native-calendar-picker";

const monthMapping = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December"
};


export default class MateUpCalendar extends Component {
  // initialize state of the calendar
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null,
      currentlySelectedDate: [],
      // Used to store information about events that match the selected date
      matchedEvents: [],

      //dummy data
      events: [
        {
          date: 15,
          month: "May",
          year: 2024,
          startTime: "10:00 AM",
          endTime: "11:00 AM",
          title: "Spinning",
          description: " ",
        },
        {
          date: 20,
          month: "August",
          year: 2024,
          startTime: "12:00 AM",
          endTime: "1:00 PM",
          title: "Conference Call",
          description: "Call with stakeholders to review project milestones.",
        },
        {
          date: 5,
          month: "May",
          year: 2024,
          startTime: "2:00 PM",
          endTime: "3:00 PM",
          title: "Training Session",
          description: "Training session for new software release.",
        },
      ],
      //make the event details not visible as a base state
      modalVisible: false,
      newEvent: {
        startTime: "",
        endTime: "",
        title: "",
        description: "",
      },
    };
  }

  //deals with the date selection
  onDateChange = (date) => {
    const currentlySelectedDate = date ? date.toString().split(" ") : [];

    //tells the terminal what to show on press
    const selectedDateDetails = {
      dayOfWeek: currentlySelectedDate[0] || "",
      month: currentlySelectedDate[1] || "",
      date: currentlySelectedDate[2] || "",
      year: currentlySelectedDate[3] || "",
    };
    console.log(selectedDateDetails);


    //find the events that match the selected date
    const matchedEvents = this.findEvents(selectedDateDetails);

    console.log(matchedEvents);

    //checks if there are events and displays them if found
    this.setState({
      selectedStartDate: date,
      currentlySelectedDate,
      matchedEvents,
      selectedDateDetails,
    });
  };


//finds the events that match the selected date
findEvents = (selectedDateDetails) => {
  const fullMonthName = monthMapping[selectedDateDetails.month];
  return this.state.events.filter(
    (event) =>
      event.date.toString() === selectedDateDetails.date &&
      event.month.toLowerCase() === fullMonthName.toLowerCase() &&
      event.year.toString() === selectedDateDetails.year
  );
};


  //adds an event
  addEvent = () => {
    const { selectedDateDetails, newEvent } = this.state;
    const newEventDetails = {
      ...newEvent,
      date: parseInt(selectedDateDetails.date),
      month: selectedDateDetails.month,
      year: parseInt(selectedDateDetails.year),
    };

    this.setState((prevState) => ({
      events: [...prevState.events, newEventDetails],
      modalVisible: false,
      newEvent: { startTime: "", endTime: "", title: "", description: "" },
      matchedEvents: [...prevState.matchedEvents, newEventDetails], // Add the new event to matched events
    }));
  };

  render() {
    const {
      selectedStartDate,
      selectedDateDetails,
      matchedEvents,
      modalVisible,
      newEvent,
    } = this.state;

    return (
      <ScrollView>
        <View style={styles.calendarStyle}>
          <CalendarPicker
            onDateChange={this.onDateChange}
            startFromMonday={true}
            todayBackgroundColor="#FE7000"
            selectedDayColor="#808080"
            selectedDayTextColor="#FFFFFF"
            calendarStyle={{ backgroundColor: "black" }}
            dayTextStyle={{ color: "white" }}
            textStyle={{ color: "white" }}
          /> 

          <Text style={styles.callToAction}>
            {" "}
            See what your buddies are crushing today!{" "}
          </Text>
          <View/>
        {/*  
          {selectedDateDetails ? (
            <View style={styles.selectedDateContainer}>
              <Text style={styles.selectedDateText}>
                {selectedDateDetails
                  ? `${selectedDateDetails.date}/${selectedDateDetails.month}/${selectedDateDetails.year} - Selected`
                  : "No date selected"}
              </Text>
            </View>
          ) : null} */}

          <View style={styles.eventContainer}>
            {matchedEvents.length > 0 ? (
              matchedEvents.map((event, index) => (
                <View key={index} style={styles.event}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventTime}>
                    {event.startTime} - {event.endTime}
                  </Text>
                  <Text style={styles.eventDescription}>
                    {event.description}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noEventText}>No events on this day</Text>
            )}
          </View>

          {/* Add Workout Button */}
          <TouchableOpacity
            style={styles.addWorkoutButton}
            onPress={() => this.setState({ modalVisible: true })}
            disabled={!selectedStartDate} // Disable button if no date is selected
          >
            <Text style={styles.addWorkoutButtonText}>Add Workout</Text>
          </TouchableOpacity>

          {/* Add Event Modal aka displays the input fields */}
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => this.setState({ modalVisible: false })}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add Workout</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Start Time"
                  value={newEvent.startTime}
                  onChangeText={(text) =>
                    this.setState({
                      newEvent: { ...newEvent, startTime: text },
                    })
                  }
                />

                <TextInput
                  style={styles.input}
                  placeholder="End Time"
                  value={newEvent.endTime}
                  onChangeText={(text) =>
                    this.setState({
                      newEvent: { ...newEvent, endTime: text },
                    })
                  }
                />

                <TextInput
                  style={styles.input}
                  placeholder="Title"
                  value={newEvent.title}
                  onChangeText={(text) =>
                    this.setState({ newEvent: { ...newEvent, title: text } })
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Description"
                  value={newEvent.description}
                  onChangeText={(text) =>
                    this.setState({
                      newEvent: { ...newEvent, description: text },
                    })
                  }
                />
                <Button title="Conform" onPress={this.addEvent} />
                <Button
                  title="Cancel"
                  onPress={() => this.setState({ modalVisible: false })}
                />
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  calendarStyle: {
    flex: 1,
   backgroundColor: "#333333",
    marginTop: 30,
  },
  selectedDateContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  callToAction: {
    fontSize: 30, 
    fontWeight: "bold",
    color: "#FF8047",
    marginLeft: 20,
    marginTop: 20,
    textAlign:'center',
  },

  eventContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  event: {
    marginBottom: 15,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "balck",
  },
  eventTime: {
    fontSize: 18,
    marginTop: 5,
    color: "black",
  },
  eventDescription: {
    fontSize: 16,
    marginTop: 5,
    color: "black",
  },
  
  noEventText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: "white",
  },

  addWorkoutButton: {
    position: 'fixed',
    top: "90%",
    right: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#333333",
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#709872",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    maxWidth: "fit-content",
  },
  addWorkoutButtonText: {
    color: "#FE7000",
    fontSize: 16,
    fontWeight: "bold",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 5,
  },
});
