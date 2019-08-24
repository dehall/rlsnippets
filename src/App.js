import React from 'react'

import USStatesChoropleth from './USStatesChoropleth';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: 'population',
      data: props.data.population
    };
  }

  handleChange = (event) => {
    this.setState({
      value: event.target.value,
      data: this.props.data[event.target.value]
    });
  }

render() {
  return ( 
    <div className="fullscreen">
    <select value={this.state.value} onChange={this.handleChange}>
            <option value="population">Population</option>
            <option value="area">Area</option>
            <option value="someOtherData">Some Other Data</option>
          </select>
     
    <USStatesChoropleth key={this.state.value} data={this.state.data} metricName={this.state.value} /> 
    </div>
    );
  }
}