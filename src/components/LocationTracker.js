import React, { useEffect } from 'react';
import { db } from '../firebaseConfig';
import { ref, update } from 'firebase/database';

const LocationTracker = ({ userId, trackingEnabled }) => {
  useEffect(() => {
    let watchId;

    const updateLocation = async (location) => {
      if (userId && trackingEnabled) {
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
      }
    };

    const handleLocationError = (error) => {
      console.error("Error getting location:", error);
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert("User denied the request for Geolocation.");
          break;
        case error.POSITION_UNAVAILABLE:
          alert("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          alert("The request to get user location timed out.");
          break;
        case error.UNKNOWN_ERROR:
          alert("An unknown error occurred.");
          break;
        default:
          alert("An unexpected error occurred.");
          break;
      }
    };

    const startTracking = () => {
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const newLocation = { latitude, longitude };
            updateLocation(newLocation);
          },
          handleLocationError,
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    };

    if (trackingEnabled) {
      startTracking();
    } else if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [userId, trackingEnabled]);

  return null; // This component doesn't render anything visually
};

export default LocationTracker;
