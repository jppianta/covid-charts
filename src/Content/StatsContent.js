import React, { Component } from 'react';
import { Statistic, Card, Table } from 'antd';
import { dataManager } from '../Data/DataManager';
import { WorldChart } from '../Charts/WorldChart';
import covidLogo from '../Assets/Covid-19-Charts.png';

export class StatsContent extends Component {
  constructor(props) {
    super(props);

    this.tableColumns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: name => (
          <div className="tableName">
            <img alt={name} src={`https://www.countryflags.io/${dataManager.data.byCountry[name].code}/flat/24.png`} />
            <span>{name}</span>
          </div>
        )
      },
      {
        title: 'Confirmed Cases',
        dataIndex: 'confirmed',
        key: 'confirmed',
        sorter: (a, b) => a.confirmed - b.confirmed
      },
      {
        title: 'Death Cases',
        dataIndex: 'deaths',
        key: 'deaths',
        sorter: (a, b) => a.deaths - b.deaths
      }
    ];

    this.state = {
      data: {
        byCountry: [],
        total: {
          confirmed: {},
          deaths: {}
        }
      }
    }
  }

  componentDidMount() {
    dataManager.addListener(this.updateStats);
  }

  updateStats = (data) => {
    const countriesData = Object.values(data.byCountry).map(country => ({
      name: country.name,
      confirmed: country.confirmed.cases,
      deaths: country.deaths.cases
    }));
    countriesData.sort((a, b) => b.confirmed - a.confirmed);
    this.setState({ data: { byCountry: countriesData, total: data.total } })
  }

  parseDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  }

  parseTime(date) {
    date = new Date(date);
    function add0(time) {
      time = String(time);
      return time.length === 1 ? "0" + time : time
    }
    return `${add0(date.getHours())}:${add0(date.getMinutes())}`
  }

  render() {
    return (
      <div className="statsContent">
        <div className="header">
          <div className="logoContainer">
            <img className="header-title" src={covidLogo} alt="Covid Logo" />
          </div>
          <Statistic
            title="Last Updated"
            value={this.parseDate(dataManager.data.total.confirmed.updated)}
            suffix={this.parseTime(dataManager.data.total.confirmed.updated)}
          />
        </div>
        <Card size="small" title="Global Stats">
          <div className="statsContainer">
            <Statistic
              title="Confirmed"
              className="blue start"
              value={this.state.data.total.confirmed.cases}
            />
            <Statistic
              title="Deaths" 
              className="cyan mid"
              value={this.state.data.total.deaths.cases}
            />
            <Statistic
              title="Death Rate"
              className="red end"
              value={(this.state.data.total.deaths.cases / this.state.data.total.confirmed.cases) * 100}
              precision={2}
              suffix='%'
            />
          </div>
        </Card>
        <div className="countriesRow">
          <Card title="World" size="small">
            <WorldChart />
          </Card>
          <Card className="countriesTableContainer" size="small" title="Cases by Country">
            <Table
              className="countriesTable"
              dataSource={this.state.data.byCountry}
              columns={this.tableColumns}
              pagination={false}
              size="middle"
            />
          </Card>
        </div>
      </div>
    )
  }
}