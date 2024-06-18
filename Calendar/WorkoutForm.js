import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, Switch, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const WorkoutForm = () => {
  const [workoutType, setWorkoutType] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [repeat, setRepeat] = useState(false);
  const [remindMe, setRemindMe] = useState(false);

  const workoutTypeOptions = ['Running', 'Cycling', 'Weightlifting', 'Yoga', 'Swimming'];
  const locationOptions = ['Gym', 'Park', 'Home', 'Beach', 'Track'];

  const handleSave = () => {
    console.log({
      workoutType,
      location,
      date,
      description,
      repeat,
      remindMe
    });
    // Add your save logic here
  };

  const handleClose = () => {
    // Add logic to close or navigate away from the form
    console.log('Form closed');
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
    backgroundColor: '#333333', // Background color for close/save buttons area
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#333333', // Background color for close/save buttons area
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#FF8047",
  },
  closeButton: {
    fontSize: 24,
    color: '#ddd', // Grayish white color for the close button
  },
  saveButton: {
    fontSize: 24,
    color: '#ddd', // Grayish white color for the save button
  },
  formSection: {
    backgroundColor: '#fff', // White background color for form section
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
    color: '#333', // Dark color for labels
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    color: '#333', // Dark color for inputs
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    color: '#333', // Dark color for switches
  },
});

export default WorkoutForm;
