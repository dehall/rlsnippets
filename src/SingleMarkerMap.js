import logo from './logo.svg';
import './App.css';

import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

const SingleMarkerMap = (props) => {
  const position = [props.lat, props.lng]
  return (
    <Map center={position} zoom={props.zoom} style={{ height: '100%' }}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          {props.text}
        </Popup>
      </Marker>
    </Map>
  )
};


export default SingleMarkerMap;