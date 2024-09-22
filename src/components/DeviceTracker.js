import { useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { ref, update, onDisconnect } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

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

    const deviceInfo = {
      deviceId: `device-${Math.random().toString(36).substr(2, 9)}`,
      deviceType: getDeviceType(),
      deviceName: navigator.platform || 'Unknown Device',
      active: true,
      lastActive: new Date().toISOString(),
    };

    const updateDeviceInfo = async (userId) => {
      try {
        deviceRef = ref(db, `trackingDevices/${primaryUserId}/${userId}`);
        await update(deviceRef, deviceInfo);
        console.log("Device info updated:", deviceInfo);
        
        onDisconnect(deviceRef).update({
          active: false,
          lastActive: new Date().toISOString(),
        });

        // Keep the device active status updated
        setInterval(() => {
          update(deviceRef, {
            lastActive: new Date().toISOString(),
            active: true,
          });
        }, 5000);
      } catch (error) {
        console.error("Error updating device info: ", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        updateDeviceInfo(user.uid);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [primaryUserId]);

  return null;
};

export default DeviceTracker;
