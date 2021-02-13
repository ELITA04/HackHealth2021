# HackHealth2021
Submission for HackHealth 2021


--------
# To run Text Detection (React Native)
1. Install expo `npm install --global expo-cli`
2. `cd OCR`
3. install all missing dependencies: `npm install`
4. `expo start`

# To connect to Firebase and the Google Cloud Vision API:
1. Create a firebase web app to get firebase api keys and database url
2. Add the Google Cloud Vision API to your firebase wep app and get the google cloud vision API key
3. Create a file called `secrets.js` within the `OCR` folder (path will be `/OCR/secrets.js`
4. `secrets.js` should have the following:
```export const FIREBASE_API_KEY = "XXX"
export const FIREBASE_DATABASE_URL = "XXX"
export const FIREBASE_PROJECT_ID = "XXX"
export const FIREBASE_MESSAGING_SENDER_ID = "XXX"
export const FIREBASE_AUTH_DOMAIN = "XXX"
export const FIREBASE_STORAGE_BUCKET = "XXX"
export const GOOGLE_CLOUD_VISION_API_KEY = "XXX" ```

