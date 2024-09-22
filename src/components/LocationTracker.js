import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { ref, update } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

const LocationTracker = ({ userId }) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    let watchId;

    // Function to update current location in Realtime Database
    const updateLocation = async (userId, location) => {
      try {
        const locationRef = ref(db, `users/${userId}/currentLocation`);
        await update(locationRef, {
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: new Date().toISOString(),
        });
        console.log("Location updated:", location);
      } catch (error) {
        console.error("Error updating location in Firebase: ", error);
      }
    };

    // Function to track the user's location
    const startTracking = () => {
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const newLocation = { latitude, longitude };
            setLocation(newLocation);
            updateLocation(userId, newLocation);
          },
          (error) => {
            console.error("Error getting location:", error);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    // Start tracking when component mounts
    if (userId) {
      startTracking();
    }

    // Clean up function to stop tracking
    return () => {
      if (navigator.geolocation && watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [userId]);

  return (
    <div>
      {location ? (
        <p>
          Current Location: Latitude {location.latitude}, Longitude{" "}
          {location.longitude}
        </p>
      ) : (
        <p>Tracking location...</p>
      )}
    </div>
  );
};

export default LocationTracker;
