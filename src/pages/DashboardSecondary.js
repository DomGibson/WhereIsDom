import React, { useEffect, useState } from 'react';
import { Box, Text, Heading, Button, SimpleGrid, Switch } from '@chakra-ui/react';
import { db } from '../firebaseConfig';
import { ref, get } from 'firebase/database';
import SecondaryMapComponent from '../components/SecondaryMapComponent';
import DeviceTracker from '../components/DeviceTracker';
import { cardStyles, mapContainerStyles, buttonStyles } from '../styles';

const DashboardSecondary = () => {
  const [primaryUserId, setPrimaryUserId] = useState('primary-uid'); // Replace with actual primary user ID
  const [lastLogin, setLastLogin] = useState('');
  const [active, setActive] = useState(false);
  const [lastTrackedLocation, setLastTrackedLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [trackingEnabled, setTrackingEnabled] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = ref(db, `users/${primaryUserId}`);
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
          <Text>Enable Tracking</Text>
          <Switch isChecked={trackingEnabled} onChange={toggleTracking} />
        </Box>
        <Box {...cardStyles.baseStyle} {...cardStyles.hoverStyle}>
          <Button {...buttonStyles.baseStyle} onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </SimpleGrid>
      <SecondaryMapComponent primaryLocation={currentLocation} />
      <DeviceTracker primaryUserId={primaryUserId} />
    </Box>
  );
};

export default DashboardSecondary;
