import { db } from '../firebaseConfig';
import { ref, set } from 'firebase/database'; // For Realtime Database

// Function to update location in Realtime Database
const updateLocationInRealtimeDB = async (location) => {
  try {
    await set(ref(db, 'locations/my-phone'), {
      latitude: location.latitude,
      longitude: location.longitude,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating location in Firebase: ", error);
  }
};
