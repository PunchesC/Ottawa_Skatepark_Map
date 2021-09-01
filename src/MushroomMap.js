import React from 'react';
import { useState, useCallback, useRef } from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow} from "@react-google-maps/api";
  import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
  } from "use-places-autocomplete";
  import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
  } from "@reach/combobox";
import {formatRelative} from "date-fns";


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

function Locate({panTo}) {
  return <button alt="locate me" onClick={()=>{
    navigator.geolocation.getCurrentPosition((position)=>{
      panTo({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    },()=> null);
  }}>Add User Location</button>
}

function Search({panTo}){
  const {ready, value, suggestions:{status, data}, setValue, clearSuggestions,} = usePlacesAutocomplete({
    requestOptions: {
      location: {lat: ()=>44.314842,
        lng: ()=>-85.602364},
        radius: 200*1000,
    },
  });
  return <Combobox onSelect={ async (address)=>{
    setValue(address, false);
    clearSuggestions();
   try {
    const results = await getGeocode({address});
    const {lat, lng} = await getLatLng(results[0]);
   panTo({lat, lng});
   } catch(error)
   {
    console.log("error!")
   }

  }}
  >
<ComboboxInput value={value} onChange={(e)=> {
  setValue(e.target.value);
}}
disabled={!ready}
placeholder="Enter an Address"
/>
<ComboboxPopover>
  <ComboboxList>
  {status === "OK" && data.map(({id,description}) => (<ComboboxOption key={id} value={description} />))}
  </ComboboxList>
</ComboboxPopover>
  </Combobox>
}

function MushroomMap() {
  const {isLoaded, loadError } = useLoadScript(
    {
      googleMapsApiKey:process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      libraries,
    });
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
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
  },[]);
  
  const panTo=useCallback(({lat,lng}) => {
    mapRef.current.panTo({lat,lng});
    mapRef.current.setZoom(14);
  }, []);

  if (loadError) return "Error loading Map";
  if(!isLoaded) return "Loading Maps";
  return (
    <div className="MushroomMap">
   <h1>Michigan Mushroom Map</h1>

    <Search panTo={panTo}/>
    <Locate panTo={panTo} />

   <GoogleMap 
    mapContainerStyle={mapContainerStyle}
    zoom={7} 
    center={center}
    onClick={
      onMapClick
    }onLoad={onMapLoad}
    >
      {markers.map((marker) => <Marker key={marker.time.toISOString()} position={{lat: marker.lat, lng: marker.lng}} 
      onClick={()=> {
        setSelected(marker);
      }}
      />)}
    {selected ? (<InfoWindow position={{lat: selected.lat,lng: selected.lng}} onCloseClick={()=>setSelected(null)}>
      <div>
        <h2>This is where the select form shall be</h2>
        <p>Spotted {formatRelative(selected.time, new Date())}</p>
      </div>
    </InfoWindow>):null}
    </GoogleMap>
      
    </div>
  );
}

export default MushroomMap;


// use to style icon and resize -- Work on later!!
// icon={{url: "src\mushroom2.png", scaledSize: new window.google.maps.Size(30,30)}}