//MateUpCalendar
import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class MateUpCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null,
      currentlySelectedDate: new Date(),
      matchedEvents: [],
      events: [
        {
          date: new Date(2024, 5, 15), // June 15, 2024
          startTime: "10:00 AM",
          endTime: "11:00 AM",
          title: "Spinning",
          description: " ",
        },
        {
          date: new Date(2024, 7, 20), // August 20, 2024
          startTime: "12:00 PM",
          endTime: "1:00 PM",
          title: "Conference Call",
          description: "Call with stakeholders to review project milestones.",
        },
      ],
    };
  }

  componentDidMount() {
    this.loadEvents();
  }

  onDateChange = (date) => {
    const selectedDate = date ? new Date(date) : new Date();
    this.updateMatchedEvents(selectedDate);
    this.setState({ selectedStartDate: date, currentlySelectedDate: selectedDate });
  };

  updateMatchedEvents = (selectedDate) => {
    const matchedEvents = this.findEvents(selectedDate);
    this.setState({ matchedEvents });
  };

  findEvents = (selectedDate) => {
    return this.state.events.filter(
      (event) => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === selectedDate.toDateString();
      }
    );
  };

  saveEvents = async () => {
    try {
      await AsyncStorage.setItem('events', JSON.stringify(this.state.events));
    } catch (error) {
      console.error('Failed to save events', error);
    }
  };

  loadEvents = async () => {
    try {
      const { currentlySelectedDate } = this.state;
      const storedEvents = await AsyncStorage.getItem('events');
      if (storedEvents !== null) {
        const parsedEvents = JSON.parse(storedEvents).map(event => ({
          ...event,
          date: new Date(event.date)
        }));
        const matchedEvents = parsedEvents.filter(
          (event) => new Date(event.date).toDateString() === currentlySelectedDate.toDateString()
        );
        this.setState({ events: parsedEvents, matchedEvents });
      }
    } catch (error) {
      console.error('Failed to load events', error);
    }
  };

  addNewEvent = (newEventDetails) => {
    const newEventWithDateObject = {
      ...newEventDetails,
      date: new Date(newEventDetails.date)
    };
    this.setState(
      (prevState) => ({
        events: [...prevState.events, newEventWithDateObject],
        matchedEvents: [...prevState.matchedEvents, newEventWithDateObject],
      }),
      async () => {
        await this.saveEvents();
      }
    );
  };

  render() {
    const { selectedStartDate, matchedEvents } = this.state;
    const { navigation } = this.props;

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
                <View key={index} style={styles.event}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventTime}>{event.startTime} - {event.endTime}</Text>
                  <Text style={styles.eventDescription}>{event.description}</Text>
                </View>
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
});






//Form

import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const WorkoutForm = ({ route, navigation }) => {
  const params = route && route.params ? route.params : {};
  const selectedDate = params.selectedDate ? new Date(params.selectedDate) : new Date();

  const [startTime, setStartTime] = useState(new Date(selectedDate));
  const [endTime, setEndTime] = useState(new Date(selectedDate.getTime() + 60 * 60 * 1000)); // +1 hour
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState(true);

  const saveEvent = () => {
    const newEvent = {
      date: selectedDate,
      startTime: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title,
      description,
      privacy,
    };
    if (params.addNewEvent) {
      params.addNewEvent(newEvent);
    }
    navigation.navigate('MateUpCalendar');
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Display selected date */}
        <Text style={styles.label}>Selected Date:</Text>
        <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
        
        <Text style={styles.label}>Workout Title:</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Enter title" />
        
        <Text style={styles.label}>Description:</Text>
        <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Enter description" />

        <Text style={styles.label}>Start Time:</Text>
        {showStartTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              const currentTime = selectedTime || startTime;
              setShowStartTimePicker(Platform.OS === 'ios');
              setStartTime(currentTime);
            }}
          />
        )}
        <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
          <Text style={styles.timeText}>{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>End Time:</Text>
        {showEndTimePicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              const currentTime = selectedTime || endTime;
              setShowEndTimePicker(Platform.OS === 'ios');
              setEndTime(currentTime);
            }}
          />
        )}
        <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
          <Text style={styles.timeText}>{endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={saveEvent} style={styles.saveButton}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#333333',
  },
  label: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  dateText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
  timeText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#FE7000',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#555555',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default WorkoutForm;
