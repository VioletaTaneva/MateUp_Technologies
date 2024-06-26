import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class MateUpCalendar extends Component {

  //sets state of the calendar
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null,
      currentlySelectedDate: new Date(),
      matchedEvents: [],
      events: [ // Dummy event data
        {
          id: 1,
          date: new Date(2024, 5, 15), // June 15, 2024
          startTime: "10:00 AM",
          endTime: "11:00 AM",
          title: "Spinning",
          description: " ",
        },
        {
          id: 2,
          date: new Date(2024, 7, 20), // August 20, 2024
          startTime: "12:00 PM",
          endTime: "1:00 PM",
          title: "Conference Call",
          description: "Call with stakeholders to review project milestones.",
        },
      ],
    };
  }

  // Checks to see if there are any added events in AsyncStorage. If there are it displayes them
  componentDidMount() {
    this.loadEvents();
  }
 //deals with the change of date
  onDateChange = (date) => {
    const selectedDate = date ? new Date(date) : new Date();
    this.updateMatchedEvents(selectedDate);
    this.setState({ selectedStartDate: date, currentlySelectedDate: selectedDate });
  };

 // It checks and changes the display and the events based on the selected date
  updateMatchedEvents = (selectedDate) => {
    const matchedEvents = this.findEvents(selectedDate);
    this.setState({ matchedEvents });
  };

  //It checks if there are any events happening on a specific date.
  findEvents = (selectedDate) => {
    return this.state.events.filter(
      (event) => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === selectedDate.toDateString();
      }
    );
  };

  //saves the events in AsyncStorage
  saveEvents = async () => {
    try {
      await AsyncStorage.setItem('events', JSON.stringify(this.state.events));
    } catch (error) {
      console.error('Failed to save events', error);
    }
  };

  //loads the events from AsyncStorage
  loadEvents = async () => {
    try {
      // Retrieves the currently selected date from the component's state
      const { currentlySelectedDate } = this.state;
      // Retrieves stored events from AsyncStorage using the key 'events'
      const storedEvents = await AsyncStorage.getItem('events');
      // Convert the stored events to an array of objects
      if (storedEvents !== null) {
        const parsedEvents = JSON.parse(storedEvents).map(event => ({
          ...event,
          // Converts the 'date' property of each event from string to Date object
          date: new Date(event.date)
        }));
        // Filters events to find those matching the currently selected date
        // and stores them in the component's state
        const matchedEvents = parsedEvents.filter(
          (event) => new Date(event.date).toDateString() === currentlySelectedDate.toDateString()
        );
        this.setState({ events: parsedEvents, matchedEvents });
      }
    } catch (error) {
      console.error('Failed to load events', error);
    }
  };

    // Create a new event object with an incremented (unique) ID and converted date
  addNewEvent = (newEventDetails) => {
    const newEventWithDateObject = {
      id: this.state.events.length + 1, // Incremented ID based on existing events
      ...newEventDetails, // Spread new event details (title, description, etc.)
      date: new Date(newEventDetails.date) // Convert date string to Date object because js works with objects and async storage only works with strings
    };

    // Update component state with the new event
    this.setState(
      (prevState) => ({
        events: [...prevState.events, newEventWithDateObject], // Add new event to events array
        matchedEvents: [...prevState.matchedEvents, newEventWithDateObject], // Add new event to events array
      }),
      async () => {
        await this.saveEvents(); // After state update, save events to AsyncStorage
      }
    );
  };

    // Filter out the event with the specified eventId from events array
  deleteEvent = (eventId) => {
    const updatedEvents = this.state.events.filter(event => event.id !== eventId);

      // Update component state with the new events array
    this.setState({ events: updatedEvents, matchedEvents: updatedEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === this.state.currentlySelectedDate.toDateString();
    }) }, async () => {
      await this.saveEvents();
    });
  };

  render() {
    const { selectedStartDate, matchedEvents } = this.state;
    const { navigation } = this.props;


  // Function to handle deletion of an event
    const handleDelete = (eventId) => {
      Alert.alert(
        "Delete Event",
        "Are you sure you want to delete this event?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { text: "Delete", onPress: () => this.deleteEvent(eventId) }
        ],
        { cancelable: true }
      );
    };

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
          <Text style={styles.callToAction}>See what your buddies are crushing today!</Text>
          <View style={styles.eventContainer}>
            {matchedEvents.length > 0 ? (
              matchedEvents.map((event, index) => (
                <TouchableOpacity
                  key={event.id}
                  style={styles.event}
                  onLongPress={() => handleDelete(event.id)}
                >
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventTime}>{event.startTime} - {event.endTime}</Text>
                  <Text style={styles.eventDescription}>{event.description}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noEventText}>No events on this day</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.addWorkoutButton}
            onPress={() => navigation.navigate('WorkoutForm', { selectedDate: selectedStartDate, addNewEvent: this.addNewEvent })}
            disabled={!selectedStartDate}
          >
            <Text style={styles.addWorkoutButtonText}>Add Workout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  // Add your styles here
  calendarStyle: {
    flex: 1,
    backgroundColor: "#333333",
    marginTop: 30,
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
    color: "black",
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
});
