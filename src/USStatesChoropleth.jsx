import './App.css';

import React, { Fragment } from 'react'
import { Map, TileLayer, GeoJSON } from 'react-leaflet';
import Control from 'react-leaflet-control';
import { getColorScheme } from './ColorUtils';
import USStatesGeoJson from './us_states_geo.json';

const getVal = (data, stateName, stateAbbr, defaultValue) => {
  return data[stateName] || data[stateAbbr] || defaultValue;
}

const onEachFeature = (feature, layer, data, metricName, defaultValue=NaN) => {
  const props = feature.properties;
  const value = getVal(data, props.NAME, props.ABBR, defaultValue);
  let displayValue;

  if (Number.isNaN(value)) {
    displayValue = 'Unknown';
  } else {
    displayValue = value.toLocaleString();
  }

  layer.bindTooltip(`<b>${props.NAME}</b> - ${metricName}${displayValue}`);
  // layer.on({
  //   click: (event) => {}
  // });
}

const featureStyle = (feature, data, colorScale, defaultValue=NaN) => {
  const props = feature.properties;
  const value = getVal(data, props.NAME, props.ABBR, defaultValue);
  let fillColor;
  for (const level of colorScale) {
    if (value >= level.min) {
      fillColor = level.color;
    }
  }
  const fillOpacity = fillColor ? 0.75 : 0;
  return { color: '#ffffff', opacity: 0.8, fillOpacity, fillColor };
}

const getLegend = (colorScale) => {
  const legendRows = [];
  for (let i = 0; i < colorScale.length; i++) {
    const row = (
      <div key={"legend-"+i}>
      <i style={{ background: colorScale[i].color }}></i>
      { Number(colorScale[i].min).toLocaleString() + (colorScale[i + 1] ? ' - ' + Number(colorScale[i + 1].min).toLocaleString()  : '+' )}
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
  const position = [39.833, -98.583]; // geographic center of CONUS
  const metricName = props.metricName ? `${props.metricName}: ` : '';

  let allValues, max, min, colorScale;

  if (props.data) { // implies done loading from an async source
    allValues = Object.values(props.data);
    max = Math.max(...allValues);
    min = Math.min(...allValues);
    colorScale = getColorScheme(8, max, min);
  }

  return (
    <Map center={position} zoom={props.zoom || 4} style={{ height: '100%' }}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      { props.data &&
        <Fragment>
          <GeoJSON 
          data={USStatesGeoJson}
          key={metricName} // set a key to ensure the geojson gets re-rendered correctly when we switch values
          onEachFeature={(f,l) => onEachFeature(f, l, props.data, metricName)} 
          style={(f) => featureStyle(f, props.data, colorScale)}
          />
          { getLegend(colorScale) }
        </Fragment>
         }
    </Map>
  )
};

export default USStatesChoropleth;