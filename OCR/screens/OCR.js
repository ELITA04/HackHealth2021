import { StyleSheet, Text, View, Button } from 'react-native';
import React from 'react'
import * as Speech from 'expo-speech';

const OCRScreen = ({ navigation, route }) => {
    const speak = () => {
        const thingToSay = '1';
        Speech.speak(thingToSay);
      };
      
    return (
        <View>
            <Text>Real Time Object Recogniton</Text>
            <Button title="Press to hear some words" onPress={speak} />
        </View>
    );
  };

export default OCRScreen;