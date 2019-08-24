import React from 'react'

import USStatesChoropleth from './USStatesChoropleth';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 'population',
      data: this.getData(props.data.population)
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

  return ( 
    <div className="fullscreen">
    <select value={this.state.value} onChange={this.handleChange}>
      { rows }
    </select>
     
    <USStatesChoropleth data={this.state.data} metricName={this.state.value} /> 
    </div>
    );
  }
}