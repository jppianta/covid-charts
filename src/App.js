import React, { Component } from 'react';
import covidDataApi from 'jhucsse.covid';
import { AppFooter } from './Footer'
import { GlobeChart } from './globeChart';
import { BarChart } from './barChart';
import { Layout } from 'antd';
import './App.css';
import { HistoryChart } from './Charts/History';
import { EvolutionChart } from './Charts/Evolution';

const { Header, Footer, Content } = Layout;

class App extends Component {
  state = { data: {}, selectedData: [] }

  onCountriesSelected = (selectedCountries) => {
    this.setState({
      selectedData: selectedCountries.map(country => this.state.data[country])
    });
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
        this.setState({ data: this.parseData(covidData) });
        // this.setState({
        //   globeData: covidData.confirmed.locations.filter(location => location.latest > 0),
        //   barData: this.getCasesByCountry(covidData)
        // })
      });
  }

  render() {
    return (
      <Layout className="App">
        <Header>Header</Header>
        <Content>
          <div className="mainContent">
            <HistoryChart data={this.state.selectedData} />
            <EvolutionChart data={this.state.selectedData} />
          </div>
        </Content>
        <AppFooter countries={Object.values(this.state.data)} onChange={this.onCountriesSelected} />
      </Layout>
    );
  }
}

export default App;


