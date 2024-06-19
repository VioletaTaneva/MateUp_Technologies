import React, { Component } from "react";
import { StyleSheet, Text, View, Button, TextInput, Modal, TouchableOpacity, ScrollView } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Month mapping. Makes it so that when I enter the full month the calendar understands what I'm talking about
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

  // Initializing the state of the calendar
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null,  // Selected date on the calendar
      currentlySelectedDate: [],  // Array storing current date details
      matchedEvents: [],  // Events that match the selected date
      modalVisible: false,  // Controls visibility of the modal for adding events
      events: [  // Dummy event data
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
      newEvent: {  // Form data for adding a new event
        startTime: "",
        endTime: "",
        title: "",
        description: "",
      },
    };
  }

  // Checks to see if there are any added events in AsyncStorage. If there are it displayes them 
  componentDidMount() {
    this.loadEvents();
  }

  // Handler for when a date is selected on the calendar
  onDateChange = (date) => {
    const currentlySelectedDate = date ? date.toString().split(" ") : [];
    const selectedDateDetails = {
      dayOfWeek: currentlySelectedDate[0] || "",
      month: currentlySelectedDate[1] || "",
      date: currentlySelectedDate[2] || "",
      year: currentlySelectedDate[3] || "",
    };

    //cheks if there are any events stored in a certin date
    this.updateMatchedEvents(selectedDateDetails);

    // Update state to reflect the newly selected date and its details
    this.setState({
      selectedStartDate: date,
      currentlySelectedDate,
      selectedDateDetails,
    });
  };

  // Updates matched events based on selected date details
  updateMatchedEvents = (selectedDateDetails) => {
    const matchedEvents = this.findEvents(selectedDateDetails);
    this.setState({ matchedEvents });
  };

  // Finds events that match the selected date details
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

  // Adds a new event to the calendar
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
        events: [...prevState.events, newEventDetails],  // Adds new event to events array
        modalVisible: false,  // Closes modal after adding event
        newEvent: { startTime: "", endTime: "", title: "", description: "" },  // Resets newEvent state
        matchedEvents: [...prevState.matchedEvents, newEventDetails],  // Updates matched events
      }),
      async () => {
        await this.saveEvents();  // Saves events to AsyncStorage after adding
      }
    );
  };

  // Saves events to AsyncStorage
  saveEvents = async () => {
    try {
      await AsyncStorage.setItem('events', JSON.stringify(this.state.events));
      console.log('Events saved successfully', this.state.events);
    } catch (error) {
      console.error('Failed to save events', error);
    }
  };

  // Loads events from AsyncStorage
  loadEvents = async () => {
    try {
      const { selectedDateDetails } = this.state;

      // Ensure we have valid selected date details before proceeding
      if (!selectedDateDetails || !selectedDateDetails.date || !selectedDateDetails.month || !selectedDateDetails.year) {
        console.log('No valid date selected');
        return;
      }

      // Retrieve events data from AsyncStorage
      const storedEvents = await AsyncStorage.getItem('events');
      console.log('Stored events', storedEvents);
      // Check if there are events stored in AsyncStorage
      if (storedEvents !== null) {
        // Parse the stored events from JSON format to JavaScript objects so that it is in a usible format
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
            {/* Check if there are matched events */}
            {matchedEvents.length > 0 ? (
               // If there are matched events, map through each event and render its details
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

          {/* Pretty much a fancy button/touchable space */}
          <TouchableOpacity
            style={styles.addWorkoutButton}
            onPress={() => this.setState({ modalVisible: true })}
            disabled={!selectedStartDate}
          >
            <Text style={styles.addWorkoutButtonText}>Add Workout</Text>
          </TouchableOpacity>

          {/* Modal for adding new events */}
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



// WorkoutForm.js
import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, Switch, Button, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const WorkoutForm = () => {
  const [workoutType, setWorkoutType] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [description, setDescription] = useState('');
  const [repeat, setRepeat] = useState(false);
  const [remindMe, setRemindMe] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const workoutTypeOptions = ['Running', 'Cycling', 'Weightlifting', 'Yoga', 'Swimming'];
  const locationOptions = ['Gym', 'Park', 'Home', 'Beach', 'Track'];

  const handleSave = () => {
    console.log({
      workoutType,
      location,
      date,
      startTime,
      endTime,
      description,
      repeat,
      remindMe
    });
    
  };

  const handleClose = () => {
   
    console.log('Form closed');
  };

  const handleStartTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || startTime;
    setShowStartTimePicker(Platform.OS === 'ios');
    setStartTime(currentTime);
  };

  const handleEndTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || endTime;
    setShowEndTimePicker(Platform.OS === 'ios');
    setEndTime(currentTime);
  };

  const showStartTimepicker = () => {
    setShowStartTimePicker(true);
  };

  const showEndTimepicker = () => {
    setShowEndTimePicker(true);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={handleClose}>
          <Text style={styles.closeButton}>x</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Workout Type</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>✓</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>Workout Type</Text>
        <Picker
          style={styles.input}
          selectedValue={workoutType}
          onValueChange={(itemValue, itemIndex) => setWorkoutType(itemValue)}
        >
          {workoutTypeOptions.map((option, index) => (
            <Picker.Item key={index} label={option} value={option} />
          ))}
        </Picker>

        <Text style={styles.label}>Location</Text>
        <Picker
          style={styles.input}
          selectedValue={location}
          onValueChange={(itemValue, itemIndex) => setLocation(itemValue)}
        >
          {locationOptions.map((option, index) => (
            <Picker.Item key={index} label={option} value={option} />
          ))}
        </Picker>

        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={text => setDate(text)}
        />

        <TouchableOpacity onPress={showStartTimepicker}>
          <Text style={styles.label}>Start Time</Text>
          <Text style={styles.input}>{startTime.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        {showStartTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display="clock"
            onChange={handleStartTimeChange}
          />
        )}

        <TouchableOpacity onPress={showEndTimepicker}>
          <Text style={styles.label}>End Time</Text>
          <Text style={styles.input}>{endTime.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        {showEndTimePicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            display="clock"
            onChange={handleEndTimeChange}
          />
        )}

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          multiline
          value={description}
          onChangeText={text => setDescription(text)}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Repeat</Text>
          <Switch
            value={repeat}
            onValueChange={value => setRepeat(value)}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Remind Me</Text>
          <Switch
            value={remindMe}
            onValueChange={value => setRemindMe(value)}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#333333', 
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#333333', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#FF8047",
  },
  closeButton: {
    fontSize: 24,
    color: '#ddd', 
  },
  saveButton: {
    fontSize: 24,
    color: '#ddd', 
  },
  formSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 3, // Optional elevation for Android shadow
    shadowColor: '#000', // Optional shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333', 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    color: '#333', 
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    color: '#333', 
  },
});

export default WorkoutForm;
