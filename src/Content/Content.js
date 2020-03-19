import React, { Component } from 'react';
import { HistoryChart } from '../Charts/History';
import { EvolutionChart } from '../Charts/Evolution';
import { Layout, Statistic, Card } from 'antd';
import { BarCasesChart } from '../Charts/BarCases';
import { LogEvolutionChart } from '../Charts/LogEvolution';

const { Content } = Layout;

export class AppContent extends Component {
  getTop4(data) {
    data = Object.values(data);
    data.sort((a, b) => b.confirmed.cases - a.confirmed.cases);
    return data.slice(0, 4);
  }

  parseDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  }

  render() {
    const mostCases = this.getTop4(this.props.data);
    return (
      <Content className="mainContainer">
        <div className="mainContent">
          <Card size="small" title="Global Stats">
            <div className="statsContainer">
              <Statistic title="Confirmed" value={this.props.totalData.confirmed.cases} />
              <Statistic title="Deaths" value={this.props.totalData.deaths.cases} />
              <Statistic title="Recovered" value={this.props.totalData.recovered.cases} />
              <Statistic title="Updated" value={this.parseDate(this.props.totalData.confirmed.updated)} />
            </div>
          </Card>
          <Card size="small" title="Top Countries">
            <div className="statsContainer">
              {
                mostCases.map(country =>
                  <Statistic key={country.name} title={country.name} value={country.confirmed.cases} />
                )
              }
            </div>
          </Card>
          <Card title="History" size="small">
            <HistoryChart data={this.props.selectedData} />
          </Card>
          <Card title="Evolution" size="small">
            <EvolutionChart data={this.props.selectedData} />
          </Card>
          <Card title="Cases Bar" size="small">
            <BarCasesChart data={this.props.selectedData} />
          </Card>
          <Card title="Logarithmic Evolution" size="small">
            <LogEvolutionChart data={this.props.selectedData} />
          </Card>
        </div>
      </Content>
    )
  }
}