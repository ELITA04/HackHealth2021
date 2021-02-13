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
      googleResponse: null,
      googleLoading: false
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
              <View>
                <Text
                    style={{
                        fontSize: 20,
                        marginBottom: 20,
                        textAlign: 'center',
                        marginHorizontal: 15,
                    }}>
                    Would you like to pick an image from your camera roll or take a photo?
                    Listening...
                    </Text>
                <Button
                    onPress={this._pickImage}
                    title="Pick an image from camera roll"
                />
                <Button onPress={this._takePhoto} title="Take a photo" />
              </View> 
          )}
          {this._maybeRenderImage()}
          {this._maybeRenderUploadingOverlay()}
          {this._maybeRenderResponse()}
          <StatusBar barStyle="default" />
        </View>
      );
    }
  
    submitToGoogle = async () => {
      try {
        this.setState({ googleLoading: true });
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

        this.setState({
          googleResponse: responseJson,
          googleLoading: false
        });
      } catch (error) {
        console.log(error);
      }
    };
  
    // when image is loading
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

    // when google is analyzing
    _maybeRenderAnalyzingOverlay = () => {
        if (this.state.googleLoading) {
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
              <ActivityIndicator color="#000000" animating size="large" />
            </View>
          );
        }
      };
  
    // if image exists, display until google is successfully loading
    _maybeRenderImage = () => {
      let { image, googleResponse } = this.state;
      if (!image || (image && googleResponse)) {
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

          <Button
            style={{ marginBottom: 10 }}
            onPress={() => this.submitToGoogle()}
            title="Analyze!"
          />
        </View>
      );
    };

    // render google response and allow user to listen
    _maybeRenderResponse = () => {
        let { googleResponse } = this.state;
        if (!googleResponse) {
            return;
        }

        const response = JSON.stringify(googleResponse.responses[0].textAnnotations[0].description).replace(/\\n/g, ' ');

        const speak = () => {
            const thingToSay = response;
            Speech.speak(thingToSay);
          };

        return (
            <View>
                <Button title="Press to listen" onPress={speak} />
                {googleResponse && (
                <Text
                    style={{ paddingVertical: 10, paddingHorizontal: 10 }}
                >
                    {response}
                </Text>
                )}
            </View>
        )
    }
  
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
