import React, { Component } from 'react';
import { HistoryChart } from '../Charts/History';
import { EvolutionChart } from '../Charts/Evolution';
import { Card, Select } from 'antd';
import { BarCasesChart } from '../Charts/BarCases';
import { LogEvolutionChart } from '../Charts/LogEvolution';
import { dataManager } from '../DataManager';

const { Option } = Select;

export class ChartsContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      countryNames: [],
      selectedData: []
    }
  }

  componentDidMount() {
    dataManager.addListener(this.updateCharts);
  }

  updateCharts = (data) => {
    const countryNames = Object.values(data.byCountry);
    countryNames.sort(function (a, b) {
      var nameA = a.name.toUpperCase(); // ignore upper and lowercase
      var nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
    this.setState({ countryNames, data: data.byCountry })
  }

  onCountriesSelected = (selectedCountries) => {
    this.setState({
      selectedData: selectedCountries.map(country => this.state.data[country])
    });
  }

  render() {
    return (
      <div className="chartsContent">
        <div className="countriesSelector">
          <span>Select the Countries you wish to see data: </span>
          <Select
            mode="multiple"
            style={{ flex: 1 }}
            placeholder="Countries"
            defaultValue={[]}
            onChange={this.onCountriesSelected}
          >
            {
              this.state.countryNames.map(country => <Option key={country.name}>{country.name}</Option>)
            }
          </Select>
        </div>
        <div className="chartsContainer">
          <Card title="History" size="small">
            <HistoryChart data={this.state.selectedData} />
          </Card>
          <Card title="Evolution" size="small">
            <EvolutionChart data={this.state.selectedData} />
          </Card>
          <Card title="Cases Bar" size="small">
            <BarCasesChart data={this.state.selectedData} />
          </Card>
          <Card title="Logarithmic Evolution" size="small">
            <LogEvolutionChart data={this.state.selectedData} />
          </Card>
        </div>
      </div>
    )
  }
}