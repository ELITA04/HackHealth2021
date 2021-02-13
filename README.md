# HelpVu
**An AI powered narration application for the visually impaired.**

## Inspiration ✨

One of the biggest challenges a visually impaired person faces is identifying objects in front of them. The visually impaired depend upon using a white cane or relying on their hearing and their other senses. However, this merely confirms the existence of an object but not the characteristics.

In addition to this, reading out their bills at restaurants, notes or any written text requires the presence of another person as these smaller fonts are usually unrecognizable.

In an attempt to help the visually impaired, we decided to create an application that correctly identifies the objects in front of them and also helps them by reading out their handwritten or printed notes to them.

## What it does 🤔

HelpVu has 2 main features

**Object Detection:**  With the help of machine learning and computer vision the user’s mobile phone camera helps to perform real object detection on the go. On identification of the object, then makes the user aware of the object in front of them by Speech.

**Text extraction:** Using Optical Character Recognition (OCR), our app extracts text from an image either taken in-app by the user, or an image from their camera roll. Our app then converts the text to speech and reads the text to the user.

## How we built it⚒️

**Object Detection:**
For this, we used Tensorflow’s pre-trained object detection model in our application, We built an algorithm for extracting Objects from consecutive frames. We used the Angular framework to build our application. For the speech, we made use of JavaScript's SpeechSynthesis library. To make a cross-platform application we used Apache Cordova to wrap our angular framework into a native container that can access the device functions of several platforms.

**Text Extraction:**
For text extraction, we used the Google Cloud Vision API to detect and extract text from user-uploaded images. We then used the Expo-speech API to read this text to the user. We integrated these into our React Native app to create a cross-platform application.

## Challenges we ran into🕵️‍♀️

**Victoria:**

**Anusha:** Since our React Native app was created with Expo, there was a bit of a challenge integrating it with firebase and the Google API.

**Mehek:** Wrapping the Javascript framework to the cross-platform application was a hectic job and solving binary errors and dependency issues while building production builds was challenging.

**Elita:** It was challenging to convert the outputs of the object detection as the inputs of the Text-To-Speech Engine in real-time. 

## Accomplishments that we're proud of🏆

**Victoria:**

**Anusha:** It was my first time using React Native! I’m proud I was able to successfully integrate the app with firebase and the Google Cloud Vision API!

**Mehek:** It was my first time building cross-platform applications using Apache Cordova also using the machine learning model in Angular was my first time and also it is my first hackathon ✌️ .

**Elita:** It was my first time working with Angular and React Native framework. I was happy that we were able to build what we initially planned.

## What we learned 💡
Our team members all had different experiences with Javascript frameworks, Machine learning, handling packages, android permissions, and REST API’s  - this was a learning experience for all of us!

## What's next for HelpVu
1. Integrating the object detection and text extraction elements together, into one React Native app. 
2. At present the object detection is trained on the COCO dataset and can only identify one among the 80 labels. In the future, we plan to build our own object detection model to identify a wider variety of objects and give a more detailed explanation of what it sees.
3. Make the whole app usable by voice-command: implement the Google Voice Actions API
4. Make the Firebase storage accessible to users, so we can start building accounts and allow users to access previously uploaded data.
5. Add more features to HelpVu - perhaps a voice-controlled map or a chatbot.

## Contributors 👩‍💻
- [Anusha](https://github.com/qrst07)
- [Victoria](https://github.com/victoriarwang)
- [Mehek](https://github.com/mehekmaley)
- [Elita](https://github.com/ELITA04)


