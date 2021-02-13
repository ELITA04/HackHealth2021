import { StyleSheet, Text, View, Button } from 'react-native';
import React from 'react'

const ProfileScreen = ({ navigation, route }) => {
    return <Text>This is {route.params.name}'s profile</Text>;
  };

export default ProfileScreen;