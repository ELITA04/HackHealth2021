import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, Button } from 'react-native';
import React from 'react'

import ProfileScreen from './screens/Profile';
import ObjectRecognitionScreen from './screens/ObjectRecognition';
import OCRScreen from './screens/OCR';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Welcome to HelpVu' }}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="ObjectRecognition" component={ObjectRecognitionScreen} />
        <Stack.Screen name="OCR" component={OCRScreen} />
      </Stack.Navigator>
    </NavigationContainer>
      
  );
}

const HomeScreen = ({ navigation }) => {
  return (
    <View>
    <Button
      title="Go to Jane's profile"
      onPress={() =>
        navigation.navigate('Profile', { name: 'Jane' })
      }
    />
    <Button
      title="What is this?"
      onPress={() =>
        navigation.navigate('ObjectRecognition', { name: 'Jane' })
      }
    />
    <Button
      title="What does this say?"
      onPress={() =>
        navigation.navigate('OCR', { name: 'Jane' })
      }
    />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
