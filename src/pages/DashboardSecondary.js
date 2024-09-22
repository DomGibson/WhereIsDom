// DashboardSecondary.js
import React, { useEffect, useState } from 'react';
import { Box, Text, Heading, Button, SimpleGrid, Switch } from '@chakra-ui/react';
import { db } from '../firebaseConfig';
import { ref, get } from 'firebase/database';
import MapComponent from '../components/MapComponent'; // Replace with your MapComponent
import DeviceTracker from '../components/DeviceTracker'; // Import DeviceTracker component
import { cardStyles, mapContainerStyles, buttonStyles } from '../styles'; // Import styles

const DashboardSecondary = () => {
  const [primaryUserId, setPrimaryUserId] = useState('primary-uid'); // Replace with actual primary user ID
  const [lastLogin, setLastLogin] = useState('');
  const [active, setActive] = useState(false);
  const [lastTrackedLocation, setLastTrackedLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [trackingEnabled, setTrackingEnabled] = useState(true); // Toggle tracking

  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = ref(db, `users/${primaryUserId}`); // Fetch data for primary user
      const userSnapshot = await get(userRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        setLastLogin(userData.lastLogin);
        setActive(userData.active);
        setLastTrackedLocation(userData.lastTrackedLocation);
        setCurrentLocation(userData.currentLocation);
      }
    };
    fetchUserData();
  }, [primaryUserId]);

  const handleLogout = () => {
    // Implement logout logic here
    console.log("User logged out");
  };

  const toggleTracking = () => {
    setTrackingEnabled(!trackingEnabled);
  };

  return (
    <Box p={4}>
      <Heading mb={4}>User Activity</Heading>
      <SimpleGrid columns={[1, null, 2]} spacing={4}>
        <Box {...cardStyles.baseStyle} {...cardStyles.hoverStyle}>
          <Text>Last Login: {lastLogin ? new Date(lastLogin).toLocaleString() : 'No data available'}</Text>
        </Box>
        <Box {...cardStyles.baseStyle} {...cardStyles.hoverStyle}>
          <Text>Currently Active: {active ? "Yes" : "No"}</Text>
        </Box>
        <Box {...cardStyles.baseStyle} {...cardStyles.hoverStyle}>
          <Text>Last Tracked Location:</Text>
          {lastTrackedLocation ? (
            <Text>
              Latitude: {lastTrackedLocation.latitude}, Longitude: {lastTrackedLocation.longitude} <br />
              Timestamp: {new Date(lastTrackedLocation.timestamp).toLocaleString()}
            </Text>
          ) : (
            <Text>No data available</Text>
          )}
        </Box>
        <Box {...cardStyles.baseStyle} {...cardStyles.hoverStyle}>
          <Text>Current Location:</Text>
          {currentLocation ? (
            <Box mt={4}>
              <MapComponent location={currentLocation} sx={mapContainerStyles} /> {/* Display the map with the current location */}
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
          <Button {...buttonStyles.baseStyle} onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        <Box {...cardStyles.baseStyle} {...cardStyles.hoverStyle}>
          <Text>Enable Tracking</Text>
          <Switch isChecked={trackingEnabled} onChange={toggleTracking} />
        </Box>
      </SimpleGrid>
      <DeviceTracker primaryUserId={primaryUserId} /> {/* Track device info */}
    </Box>
  );
};

export default DashboardSecondary;
