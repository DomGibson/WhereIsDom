import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const MapComponent = ({ location }) => {
  const defaultCenter = {
    lat: location?.latitude || 0,
    lng: location?.longitude || 0,
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={defaultCenter} zoom={15}>
        {location && <Marker position={defaultCenter} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
