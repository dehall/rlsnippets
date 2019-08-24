import './App.css';

import React from 'react'
import { Map, TileLayer, GeoJSON } from 'react-leaflet';
import Control from 'react-leaflet-control';
import { getColorScheme } from './ColorUtils';
import USStatesGeoJson from './us_states_geo.json';

// const thingClicked = (e) => {
//   // e = event
//   console.log(e);
// }


const getVal = (data, stateName, stateAbbr, defaultValue) => {
  return data[stateName] || data[stateAbbr] || defaultValue;
}

const onEachFeature = (feature, layer, data, metricName, defaultValue=0) => {
  const props = feature.properties;
    console.log('onEachFeature ' + metricName + ' ' + props.NAME);
  const value = getVal(data, props.NAME, props.ABBR, defaultValue);
  layer.bindTooltip(`<b>${props.NAME}</b> - ${metricName}${value.toLocaleString()}`);
  // layer.on({
  //   click: thingClicked
  // });
}

const featureStyle = (feature, data, colorScale, defaultValue=0) => {
  const props = feature.properties;
  const value = getVal(data, props.NAME, props.ABBR, defaultValue);
  let fillColor = '#ffffff';
  for (const levelVal in colorScale) {
    if (value > levelVal) {
      fillColor = colorScale[levelVal];
    }
  }
  return { color: '#ffffff', opacity: 0.8, fillOpacity: 0.75, fillColor };
}

const getLegend = (colorScale) => {
  const legendRows = [];
  const entries = Object.entries(colorScale);
  for (let i = 0; i < entries.length; i++) {
    const row = (
      <div>
      <i style={{ background: entries[i][1] }}></i>
      { Number(entries[i][0]).toLocaleString() + (entries[i + 1] ? ' - ' + Number(entries[i + 1][0]).toLocaleString()  : '+' )}
      </div>
    );

      legendRows.push(row);
  }


  return (
    <Control position="bottomright">
       <ul className="info legend">
          {legendRows}
        </ul>  
    </Control>
  );
};

const USStatesChoropleth = (props) => {
  // IMPORTANT: always set a unique "key" prop to ensure this is re-rendered when necessary
  // the react-leaflet doesn't correctly update the onEachFeature
  const position = [39.833, -98.583]; // geographic center of CONUS
  const metricName = props.metricName ? `${props.metricName}: ` : '';
  const allValues = Object.values(props.data);
  const max = Math.max(...allValues);
  const min = Math.min(...allValues);
  const colorScale = getColorScheme(8, max, min);

  debugger;
  return (
    <Map center={position} zoom={props.zoom || 4} style={{ height: '100%' }}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON 
        data={USStatesGeoJson} 
        onEachFeature={(f,l) => onEachFeature(f, l, props.data, metricName)} 
        style={(f) => featureStyle(f, props.data, colorScale)}
        />
      { getLegend(colorScale) }
    </Map>
  )
};

export default USStatesChoropleth;