import React, { useEffect, useState } from 'react';
import { Box, Text, Heading, SimpleGrid, Button, Switch } from '@chakra-ui/react';
import { auth, db } from '../firebaseConfig';
import { ref, get, onValue, update } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import LocationTracker from '../components/LocationTracker';
import MapDisplay from '../components/MapDisplay';
import { cardStyles, mapContainerStyles, buttonStyles, gridStyles } from '../styles';
import useAutoRefresh from '../hooks/useAutoRefresh';

const DashboardPrimary = () => {
  const [mileage, setMileage] = useState(0);
  const [trackingDevices, setTrackingDevices] = useState([]);
  const [userId, setUserId] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [trackingEnabled, setTrackingEnabled] = useState(true); // Default to true
  const navigate = useNavigate();

  const fetchData = () => {
    if (userId) {
      const fetchUserData = async (uid) => {
        try {
          const userRef = ref(db, `users/${uid}`);
          const userSnapshot = await get(userRef);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            setMileage(userData.totalMileage || 0);
            setTrackingDevices(userData.trackingDevices || []);
            setCurrentLocation(userData.currentLocation || null);
            setTrackingEnabled(userData.trackingEnabled ?? true); // Default to true if not set
          } else {
            console.error("No user data found.");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      };

      fetchUserData(userId);
    }
  };

  useAutoRefresh(fetchData, 15000);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchData();
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const toggleTracking = async () => {
    if (userId) {
      try {
        const userRef = ref(db, `users/${userId}`);
        await update(userRef, {
          trackingEnabled: !trackingEnabled,
        });
        setTrackingEnabled(!trackingEnabled);
      } catch (error) {
        console.error("Error updating tracking status: ", error);
      }
    }
  };

  return (
    <Box p={4}>
      <Heading mb={4}>Dashboard</Heading>
      <SimpleGrid {...gridStyles.baseStyle}>
        <Box {...cardStyles.baseStyle} {...cardStyles.hoverStyle}>
          <Text>Total Mileage Covered: {mileage} km</Text>
        </Box>
        <Box {...cardStyles.baseStyle} {...cardStyles.hoverStyle}>
          <Text>Devices Currently Tracking You:</Text>
          {trackingDevices.length > 0 ? (
            trackingDevices.map((device, index) => (
              <Text key={index}>
                Device Name: {device.deviceName} ({device.deviceType}) - Active: {device.active ? 'Yes' : 'No'}
                <br />
                Last Active: {device.lastActive ? new Date(device.lastActive).toLocaleString() : 'No data'}
              </Text>
            ))
          ) : (
            <Text>No devices tracking you currently.</Text>
          )}
        </Box>
        <Box {...cardStyles.baseStyle} {...cardStyles.hoverStyle}>
          <Text>Current Location:</Text>
          {currentLocation ? (
            <Box mt={4}>
              <MapDisplay location={currentLocation} sx={mapContainerStyles} /> {/* Display the map with the current location */}
              <Text>
                Latitude: {currentLocation.latitude}, Longitude: {currentLocation.longitude} <br />
                Timestamp: {new Date(currentLocation.timestamp).toLocaleString()}
              </Text>
            </Box>
          ) : (
            <Text>No data available</Text>
          )}
        </Box>
        <Box {...cardStyles.baseStyle} {...cardStyles.hoverStyle}>
          <Text>Enable Tracking</Text>
          <Switch isChecked={trackingEnabled} onChange={toggleTracking} />
        </Box>
        <Box {...cardStyles.baseStyle} {...cardStyles.hoverStyle}>
          <Button {...buttonStyles.baseStyle} onClick={() => navigate('/logout')}>
            Logout
          </Button>
        </Box>
      </SimpleGrid>
      <LocationTracker userId={userId} trackingEnabled={trackingEnabled} /> {/* Use LocationTracker component */}
    </Box>
  );
};

export default DashboardPrimary;
