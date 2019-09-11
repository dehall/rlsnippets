import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import USStatesChoropleth from './USStatesChoropleth';

require('highcharts/modules/histogram-bellcurve')(Highcharts);


export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 'population',
      data: this.getData(props.data.population),
      sort: 'keys'
    };
  }

  getData = (data) => {
    if (typeof data === 'function') {
      return data(this.getDataCallback);
    } else if (data && typeof data.then === 'function') {
      // promise
      data.then(this.getDataCallback);
      return null;
    }

    return data;
  }

  getDataCallback = (response, error) => {
    if (!error) {
      this.setState({ data: response });
    }
  }

  handleChange = (event) => {
    const value = event.target.value;
    const data = this.getData(this.props.data[value]);
    this.setState({ value, data });
  }

render() {
  const rows = Object.keys(this.props.data).map(key => <option key={key} value={key}>{key}</option>);

  const chartData = this.state.data ? Object.entries(this.state.data) : [];

  if (this.state.sort === 'keys') {
    // compare strings
    chartData.sort((a, b) => b[0].localeCompare(a[0]));
  } else {
    // compare numbers
    chartData.sort((a, b) => b[1] - a[1]);
  }

  

  const options = {
    title: {
      text: 'My chart'
    },
    xAxis: {
          categories: chartData.map(e => e[0]),
        },
        series: [
          {type: 'histogram', data: chartData.map(e => e[1]) }
        ]
  };

  return ( 
    <div className="fullscreen">
    <select value={this.state.value} onChange={this.handleChange}>
      { rows }
    </select>
     
    {/* <USStatesChoropleth data={this.state.data} metricName={this.state.value} /> */}
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
    </div>
    );
  }
}