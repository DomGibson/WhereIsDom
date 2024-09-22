/* global google */
import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { Spinner, Box, Text } from '@chakra-ui/react';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: 'md',
  border: '1px solid #e2e8f0',
  boxShadow: 'lg',
};

const SecondaryMapComponent = ({ primaryLocation }) => {
  const [loading, setLoading] = useState(true);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState('');
  const [error, setError] = useState(null);

  const calculateRoute = (currentLocation, primaryLocation) => {
    const directionsService = new google.maps.DirectionsService(); // No more ESLint error

    directionsService.route(
      {
        origin: { lat: currentLocation.latitude, lng: currentLocation.longitude },
        destination: { lat: primaryLocation.latitude, lng: primaryLocation.longitude },
        travelMode: google.maps.TravelMode.DRIVING, // No more ESLint error
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) { // No more ESLint error
          setDirections(result);
          const distance = result.routes[0].legs[0].distance.text;
          setDistance(distance);
        } else {
          console.error(`Error fetching directions ${result}`);
          setError('Could not calculate route.');
        }
      }
    );
  };

  useEffect(() => {
    if (primaryLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          calculateRoute(currentLocation, primaryLocation);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError('Could not get your location.');
          setLoading(false);
        }
      );
    }
  }, [primaryLocation]);

  return (
    <Box position="relative">
      {loading && (
        <Spinner
          size="xl"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          color="teal"
        />
      )}
      {error && <Text color="red.500">{error}</Text>}
      {!loading && primaryLocation && (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={{ lat: primaryLocation.latitude, lng: primaryLocation.longitude }}
            zoom={12}
          >
            <Marker position={{ lat: primaryLocation.latitude, lng: primaryLocation.longitude }} />
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
          <Box mt={4}>
            <Text>Distance to Primary User: {distance}</Text>
          </Box>
        </LoadScript>
      )}
    </Box>
  );
};

export default SecondaryMapComponent;
