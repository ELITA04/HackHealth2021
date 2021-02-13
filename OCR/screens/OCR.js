import * as Speech from 'expo-speech';
import React from 'react';
import {
  ActivityIndicator,
  Button,
  Clipboard,
  Image,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  View,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'uuid';
import Environment from "../config/environment";
import firebase from "../config/firebase";

export default class OCRScreen extends React.Component {
    state = {
      image: null,
      uploading: false,
      googleResponse: null
    };
    
    async componentDidMount() {
      await Permissions.askAsync(Permissions.CAMERA_ROLL);
      await Permissions.askAsync(Permissions.CAMERA);
    }
  
    render() {
      let { image } = this.state;
  
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {image ? null : (
            <Text
              style={{
                fontSize: 20,
                marginBottom: 20,
                textAlign: 'center',
                marginHorizontal: 15,
              }}>
              Example: Upload ImagePicker result
            </Text>
          )}
  
          <Button
            onPress={this._pickImage}
            title="Pick an image from camera roll"
          />
          <Button onPress={this._takePhoto} title="Take a photo" />
          {this.state.googleResponse && (
                <FlatList
                  data={this.state.googleResponse.responses[0].labelAnnotations}
                  extraData={this.state}
                  keyExtractor={this._keyExtractor}
                  renderItem={({ item }) => <Text>Item: {item.description}</Text>}
                />
              )}
  
          {this._maybeRenderImage()}
          {this._maybeRenderUploadingOverlay()}
          <StatusBar barStyle="default" />
        </View>
      );
    }
  
    submitToGoogle = async () => {
      try {
        this.setState({ uploading: true });
        let { image } = this.state;
        let body = JSON.stringify({
          requests: [
            {
              features: [
                { type: "TEXT_DETECTION"},
              ],
              image: {
                source: {
                  imageUri: image
                }
              }
            }
          ]
        });
        let response = await fetch(
          "https://vision.googleapis.com/v1/images:annotate?key=" +
            Environment["GOOGLE_CLOUD_VISION_API_KEY"],
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            method: "POST",
            body: body
          }
        );
        let responseJson = await response.json();
        console.log(responseJson);
        this.setState({
          googleResponse: responseJson,
          uploading: false
        });
      } catch (error) {
        console.log(error);
      }
    };
  
    _maybeRenderUploadingOverlay = () => {
      if (this.state.uploading) {
        return (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: 'rgba(0,0,0,0.4)',
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}>
            <ActivityIndicator color="#fff" animating size="large" />
          </View>
        );
      }
    };
  
    _maybeRenderImage = () => {
      let { image, googleResponse } = this.state;
      if (!image) {
        return;
      }
  
      return (
        <View
          style={{
            marginTop: 30,
            width: 250,
            borderRadius: 3,
            elevation: 2,
          }}>
            <Button
            style={{ marginBottom: 10 }}
            onPress={() => this.submitToGoogle()}
            title="Analyze!"
          />
  
          <View
            style={{
              borderTopRightRadius: 3,
              borderTopLeftRadius: 3,
              shadowColor: 'rgba(0,0,0,1)',
              shadowOpacity: 0.2,
              shadowOffset: { width: 4, height: 4 },
              shadowRadius: 5,
              overflow: 'hidden',
            }}>
            <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
          </View>
  
          <Text
            onPress={this._copyToClipboard}
            onLongPress={this._share}
            style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
            {image}
          </Text>
          <Text>Raw JSON:</Text>
            {googleResponse && (
              <Text
                onPress={this._copyToClipboard}
                onLongPress={this._share}
                style={{ paddingVertical: 10, paddingHorizontal: 10 }}
              >
                JSON.stringify(googleResponse.responses)}
              </Text>
            )}
        </View>
      );
    };
  
    _keyExtractor = (item, index) => item.id;
  
    _renderItem = item => {
      <Text>response: {JSON.stringify(item)}</Text>;
    };
  
    _share = () => {
      Share.share({
        message: this.state.image,
        title: 'Check out this photo',
        url: this.state.image,
      });
    };
  
    _copyToClipboard = () => {
      Clipboard.setString(this.state.image);
      alert('Copied image URL to clipboard');
    };
  
    _takePhoto = async () => {
      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
  
      this._handleImagePicked(pickerResult);
    };
  
    _pickImage = async () => {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
  
      this._handleImagePicked(pickerResult);
    };
  
    _handleImagePicked = async pickerResult => {
      try {
        this.setState({ uploading: true });
  
        if (!pickerResult.cancelled) {
          uploadUrl = await uploadImageAsync(pickerResult.uri);
          this.setState({ image: uploadUrl });
        }
      } catch (e) {
        console.log(e);
        alert('Upload failed, sorry :(');
      } finally {
        this.setState({ uploading: false });
      }
    };
  }
  
  async function uploadImageAsync(uri) {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  
    const ref = firebase
      .storage()
      .ref()
      .child(uuid.v4());
    const snapshot = await ref.put(blob);
  
    // We're done with the blob, close and release it
    blob.close();
  
    return await snapshot.ref.getDownloadURL();
  }

// const OCRScreen = ({ navigation, route }) => {
//     const speak = () => {
//         const thingToSay = '1';
//         Speech.speak(thingToSay);
//       };
      
//     return (
//         <View>
//             <Text>Real Time Object Recogniton</Text>
            
//             <Button title="Press to hear some words" onPress={speak} />
//         </View>
//     );
//   };

