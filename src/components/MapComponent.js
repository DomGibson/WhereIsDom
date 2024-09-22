import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Spinner, Box } from '@chakra-ui/react';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: 'md',
  border: '1px solid #e2e8f0',
  boxShadow: 'lg',
};

const MapComponent = ({ location }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location) {
      setLoading(false);
    }
  }, [location]);

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
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        onLoad={() => setLoading(false)}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={{ lat: location?.latitude || 0, lng: location?.longitude || 0 }}
          zoom={15}
        >
          {location && <Marker position={{ lat: location.latitude, lng: location.longitude }} />}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
};

export default MapComponent;
