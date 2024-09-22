import React, { useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { ref, update, onDisconnect, onValue } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

// Function to determine the device type
const getDeviceType = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
    return "iOS";
  } else if (userAgent.includes("android")) {
    return "Android";
  }
  return "Unknown";
};

const DeviceTracker = ({ primaryUserId }) => {
  useEffect(() => {
    let deviceRef;
    let intervalId;

    // Device information
    const deviceInfo = {
      deviceId: `device-${Math.random().toString(36).substr(2, 9)}`, // Unique identifier for the device
      deviceType: getDeviceType(), // Determine device type
      deviceName: navigator.platform || 'Unknown Device', // Platform as device name
      active: true,
      lastActive: new Date().toISOString(),
    };

    // Function to update device info in Realtime Database
    const updateDeviceInfo = async (userId) => {
      try {
        deviceRef = ref(db, `trackingDevices/${primaryUserId}/${userId}`);
        await update(deviceRef, deviceInfo);
        console.log("Device info updated:", deviceInfo);
        
        // Handle disconnection - set active to false when disconnected
        onDisconnect(deviceRef).update({
          active: false,
          lastActive: new Date().toISOString(),
        });
        
        // Update last active time every 5 seconds to keep the device active
        intervalId = setInterval(() => {
          update(deviceRef, {
            lastActive: new Date().toISOString(),
            active: true, // Keep active true while logged in
          });
        }, 5000);
      } catch (error) {
        console.error("Error updating device info: ", error);
      }
    };

    // Listen to the authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, update device info
        updateDeviceInfo(user.uid);
      } else {
        // User is not signed in, do nothing
      }
    });

    return () => {
      unsubscribe();
      if (intervalId) clearInterval(intervalId); // Clear interval on component unmount
    };
  }, [primaryUserId]);

  return null; // This component doesn't render anything visually
};

export default DeviceTracker;
