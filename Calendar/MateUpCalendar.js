import React, { Component } from "react";
import { StyleSheet, Text, View, Button, TextInput, Modal, TouchableOpacity, ScrollView } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Month mapping
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

  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null,
      currentlySelectedDate: [],
      matchedEvents: [],
      events: [],
      modalVisible: false,
      events: [
        {
          date: 15,
          month: "June",
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
      ],
      newEvent: {
        startTime: "",
        endTime: "",
        title: "",
        description: "",
      },
    };
  }

  componentDidMount() {
    this.loadEvents();
  }

  onDateChange = (date) => {
    const currentlySelectedDate = date ? date.toString().split(" ") : [];
    const selectedDateDetails = {
      dayOfWeek: currentlySelectedDate[0] || "",
      month: currentlySelectedDate[1] || "",
      date: currentlySelectedDate[2] || "",
      year: currentlySelectedDate[3] || "",
    };
  
    this.updateMatchedEvents(selectedDateDetails);
  
    this.setState({
      selectedStartDate: date,
      currentlySelectedDate,
      selectedDateDetails,
    });

    ()=>{
      this.loadEvents();
    }
  };
  
  // New method to update matched events
  updateMatchedEvents = (selectedDateDetails) => {
    const matchedEvents = this.findEvents(selectedDateDetails);
    this.setState({ matchedEvents });
  };
  

  findEvents = (selectedDateDetails) => {
    const fullMonthName = monthMapping[selectedDateDetails.month];
    const filteredEvents = this.state.events.filter(
      (event) =>
        event.date.toString() === selectedDateDetails.date &&
        event.month.toLowerCase() === fullMonthName.toLowerCase() &&
        event.year.toString() === selectedDateDetails.year
    );
    return [...filteredEvents];
  };
  
  addEvent = async () => {
    const { selectedDateDetails, newEvent } = this.state;
    const newEventDetails = {
      ...newEvent,
      date: parseInt(selectedDateDetails.date),
      month: selectedDateDetails.month,
      year: parseInt(selectedDateDetails.year),
    };

    this.setState(
      (prevState) => ({
        events: [...prevState.events, newEventDetails],
        modalVisible: false,
        newEvent: { startTime: "", endTime: "", title: "", description: "" },
        matchedEvents: [...prevState.matchedEvents, newEventDetails],
      }),
      async () => {
        await this.saveEvents(); 
      }
    );
  };

  saveEvents = async () => {
    try {
      await AsyncStorage.setItem('events', JSON.stringify(this.state.events));
      console.log('Events saved successfully', this.state.events);
    } catch (error) {
      console.error('Failed to save events', error);
    }
  };
  
  
  loadEvents = async () => {
    try {
      const { selectedDateDetails } = this.state;
  
      // Ensure we have valid selected date details before proceeding
      if (!selectedDateDetails || !selectedDateDetails.date || !selectedDateDetails.month || !selectedDateDetails.year) {
        console.log('No valid date selected');
        return;
      }
  
      const storedEvents = await AsyncStorage.getItem('events');
      console.log('Stored events', storedEvents);
      if (storedEvents !== null) {
        const parsedEvents = JSON.parse(storedEvents);
        // Filter events by the selected date
        const matchedEvents = parsedEvents.filter((event) => {
          const fullMonthName = monthMapping[selectedDateDetails.month];
          return (
            event.date.toString() === selectedDateDetails.date &&
            event.month.toLowerCase() === fullMonthName.toLowerCase() &&
            event.year.toString() === selectedDateDetails.year
          );
        });
        // Update the state with matched events
        this.setState({ events: parsedEvents, matchedEvents });
    }
  } catch (error) {
    console.error('Failed to load events', error);
  }
};
  
  
  

  render() {
    const { selectedStartDate, matchedEvents, modalVisible, newEvent } = this.state;

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
            See what your buddies are crushing today!
          </Text>

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

          <TouchableOpacity
            style={styles.addWorkoutButton}
            onPress={() => this.setState({ modalVisible: true })}
            disabled={!selectedStartDate}
          >
            <Text style={styles.addWorkoutButtonText}>Add Workout</Text>
          </TouchableOpacity>

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
                <Button title="Confirm" onPress={this.addEvent} />
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

// Styles for the components
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
    fontSize: 24, 
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
    padding: 10,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "balck",
  },
  eventTime: {
    fontSize: 14,
    marginTop: 5,
    color: "black",
  },
  eventDescription: {
    fontSize: 14,
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
    position: 'absolute',
    bottom: 10,
    right: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#333333",
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#709872",
    justifyContent: "center",
    alignItems: "center",
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
