import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SingleMarkerMap from './SingleMarkerMap';
import USStatesChoropleth from './USStatesChoropleth';
import App from './App';
import * as serviceWorker from './serviceWorker';
import population from './data/population.json';
import area from './data/area.json';


const someOtherData = { MA: 12345, NH: 123, ME: 12};

const data = {population, area, someOtherData}

ReactDOM.render(<App data={data}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
