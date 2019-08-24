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

const getJsonFn = (url, processor=null) => {
	if (!processor) processor = j => j; // passthru function
	return (callback) => {
		fetch(url)
		  .then(response => response.json())
		  .then(json => processor(json))
		  .then(json => callback(json));
	}
}


const processCdcSmokingData = (json) => {
	const result = {};
	const lines2010 = json.data.filter(l => l[8] === '2010');
	for (const line of lines2010) {
		const stateName = line[9];
		if (stateName === 'Virgin Islands' || stateName.startsWith('Nationwide')) continue;
		const smokeEveryday = line[10];
		const smokeSomeDays = line[11];
		result[stateName] = Number(smokeEveryday) + Number(smokeSomeDays);
	}
	return result;
}

const data = {
	population,
	area: getJsonFn('https://raw.githubusercontent.com/dehall/rlsnippets/master/src/data/population.json'),
	smoking: getJsonFn('https://data.cdc.gov/api/views/8zak-ewtm/rows.json?accessType=DOWNLOAD', processCdcSmokingData),
	someOtherData: Promise.resolve(someOtherData)
};

ReactDOM.render(<App data={data}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
