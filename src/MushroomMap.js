import React from 'react';
import { useState, useCallback, useRef } from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow} from "@react-google-maps/api";
import {formatRelative} from "date-fns";
import "@reach/combobox/styles.css";

import './App.css';

const libraries = ["places"];
const mapContainerStyle = {
  width: ' 90vw',
  height: '90vh'
}
const center = {
  lat:44.314842,
  lng:-85.602364
}
// // NOT DOING ANY SPECIAL STYLIZES from snazzy maps @ 9:45 ||   disableDefaultUI:true, && this goes in googleMap options={options} 
// const options = {
//   disableDefaultUI:true,
// }


function MushroomMap() {
  const {isLoaded, loadError } = useLoadScript(
    {
      googleMapsApiKey:process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      libraries,
    });
  const [markers, setMarkers] = useState([]);
  const onMapClick = useCallback((event)=> {
    setMarkers(current => [...current, {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      time: new Date(),
    }])
   }, []);

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current=map;
  },[])

  if (loadError) return "Error loading Map";
  if(!isLoaded) return "Loading Maps";
  return (
    <div className="MushroomMap">
   <h1>Michigan Mushroom Map</h1>
   <GoogleMap 
    mapContainerStyle={mapContainerStyle}
    zoom={7} 
    center={center}
    onClick={
      onMapClick
    }onLoad={onMapLoad}
    >
      {markers.map((marker) => <Marker key={marker.time.toISOString()} position={{lat: marker.lat, lng: marker.lng}} />)}

    </GoogleMap>
      
    </div>
  );
}

export default MushroomMap;


// use to style icon and resize -- Work on later!!
// icon={{url: "src\mushroom2.png", scaledSize: new window.google.maps.Size(30,30)}}