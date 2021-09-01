import React from 'react';
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
  const [markers, setMarkers]

  if (loadError) return "Error loading Map";
  if(!isLoaded) return "Loading Maps";
  return (
    <div className="MushroomMap">
   <h1>Michigan Mushroom Map</h1>
   <GoogleMap 
    mapContainerStyle={mapContainerStyle}
    zoom={7} 
    center={center}
    onClick={(event)=> {
     console.log(event);
    }
    }
    ></GoogleMap>
      
    </div>
  );
}

export default MushroomMap;
