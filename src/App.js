import React, { Component } from 'react';
import covidDataApi from 'jhucsse.covid';
import { AppFooter } from './Footer'
import { Layout, Spin } from 'antd';
import './App.css';
import { AppHeader } from './Header';
import { AppContent } from './Content/Content';

class App extends Component {
  state = { data: {}, selectedData: [], totalData: {}, loaded: false }

  onCountriesSelected = (selectedCountries) => {
    this.setState({
      selectedData: selectedCountries.map(country => this.state.data[country])
    });
  }

  getTotalData(covidData) {
    return {
      confirmed: { cases: covidData.confirmed.latest, updated: covidData.confirmed.last_updated },
      deaths: { cases: covidData.deaths.latest, updated: covidData.deaths.last_updated },
      recovered: { cases: covidData.recovered.latest, updated: covidData.recovered.last_updated }
    }
  }

  parseData(covidData) {
    const countries = {};
    function mergeHistory(history1, history2) {
      Object.keys(history2).forEach(key => history1[key] = (history1[key] || 0) + history2[key])
      return history1;
    }

    function parseData(data, type) {
      data.locations.forEach(location => {
        if (!countries[location.country]) {
          countries[location.country] = {
            name: location.country,
            coordinates: location.coordinates,
            confirmed: { provinces: {}, cases: 0, history: {} },
            deaths: { provinces: {}, cases: 0, history: {} },
            recovered: { provinces: {}, cases: 0, history: {} }
          }
        }

        const typeMap = countries[location.country][type];

        typeMap.cases += location.latest;
        typeMap.history = mergeHistory(typeMap.history, location.history);

        if (location.province !== "") {
          typeMap.provinces[location.province] = {
            name: location.province,
            cases: location.latest,
            history: location.history
          }
        }
      });
    }

    parseData(covidData.confirmed, 'confirmed');
    parseData(covidData.deaths, 'deaths');
    parseData(covidData.recovered, 'recovered');
    return countries;
  }

  componentDidMount() {
    covidDataApi.all()
      .then(covidData => {
        console.log(covidData);
        this.setState({
          data: this.parseData(covidData),
          totalData: this.getTotalData(covidData),
          loaded: true
        });
      });
  }

  render() {
    return (
      <div className="App">
        {
          !this.state.loaded ?
            <Spin className="spinner-container" /> :
            <Layout className="App">
              <AppHeader />
              <AppContent data={this.state.data} selectedData={this.state.selectedData} totalData={this.state.totalData} />
              <AppFooter countries={Object.values(this.state.data)} onChange={this.onCountriesSelected} />
            </Layout>
        }
      </div>
    );
  }
}

export default App;


