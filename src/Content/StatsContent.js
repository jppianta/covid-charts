import React, { Component } from 'react';
import { Statistic, Card, Table } from 'antd';
import { dataManager } from '../Data/DataManager';

export class StatsContent extends Component {
  constructor(props) {
    super(props);

    this.tableColumns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
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

    this.setState({ data: { byCountry: countriesData, total: data.total } })
  }

  getTop6(data) {
    data.sort((a, b) => b.confirmed - a.confirmed);
    return data.slice(0, 6);
  }

  parseDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${this.parseTime(date)}`
  }

  parseTime(date) {
    function add0(time) {
      time = String(time);
      return time.length === 1 ? "0" + time : time
    }
    return `${add0(date.getHours())}:${add0(date.getMinutes())}`
  }

  render() {
    return (
      <div className="statsContent">
        <Card size="small" title="Global Stats">
          <div className="statsContainer">
            <Statistic title="Confirmed" value={this.state.data.total.confirmed.cases} />
            <Statistic title="Deaths" value={this.state.data.total.deaths.cases} />
            <Statistic className="updateTime" title="Last Updated" value={this.parseDate(this.state.data.total.confirmed.updated)} />
          </div>
        </Card>
        <div className="countriesRow">
          <Card className="countriesTableContainer" size="small" title="Cases by Country">
            <Table
              className="countriesTable"
              dataSource={this.state.data.byCountry}
              columns={this.tableColumns}
              pagination={false}
              size="middle"
            />
          </Card>
          <Card size="small" title="Countries with most Confirmed Cases" >
            <div className="topCountries">
              {
                this.getTop6(this.state.data.byCountry).map(country =>
                  <Statistic key={country.name} title={country.name} value={country.confirmed} />
                )
              }
            </div>
          </Card>
        </div>
      </div>
    )
  }
}