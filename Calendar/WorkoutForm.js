import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, Platform, StyleSheet, Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const WorkoutForm = ({ route, navigation }) => {
  // These lines are used to handle form inputs for adding events to the calendar.
  // They manage different aspects of the workout form state.

  // Checks if there are any special instructions (params) on the route.
  // If params exist, they are used; otherwise, an empty object is prepared.
  const params = route && route.params ? route.params : {};

  // Sets the date for the workout plan; defaults to today's date if not specified.
  const selectedDate = params.selectedDate ? new Date(params.selectedDate) : new Date();

  // Initialize state variables using useState hook
  const [startTime, setStartTime] = useState(new Date(selectedDate));
  const [endTime, setEndTime] = useState(new Date(selectedDate.getTime() + 60 * 60 * 1000)); // +1 hour
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [repeat, setRepeat] = useState(false); // Updated state for repeating event
  const [remindMe, setRemindMe] = useState(false); // Updated state for reminders

  // This function saves the details of a new event based on the form inputs.
  // It constructs a new event object and passes it to the parent component if specified.
  const saveEvent = () => {
    const newEvent = {
      date: selectedDate,
      startTime: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title,
      description,
      repeat,
      remindMe,
    };
    if (params.addNewEvent) {
      params.addNewEvent(newEvent);
    }
    navigation.navigate('MateUpCalendar');
  };

  const handleSave = () => {
    // Handle save functionality here
  };

  return (
    <ScrollView>

      <View style={styles.container}>
        
        <Text style={styles.title}>Add Workout</Text>

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

        {/* Switches */}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF8047',
    marginBottom: 20,
    textAlign: 'center',
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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

