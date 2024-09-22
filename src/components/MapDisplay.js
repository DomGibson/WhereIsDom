import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'; // Assuming you're using Google Maps

const containerStyle = {
  width: '100%',
  height: '400px',
};

const MapDisplay = ({ location }) => {
  const [mapCenter, setMapCenter] = useState({
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    if (location) {
      setMapCenter({
        lat: location.latitude,
        lng: location.longitude,
      });
    }
  }, [location]);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={15}>
        {location && <Marker position={mapCenter} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapDisplay;
