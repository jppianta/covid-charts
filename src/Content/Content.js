import React, { Component } from 'react';
import { HistoryChart } from '../Charts/History';
import { EvolutionChart } from '../Charts/Evolution';
import { Layout, Row, Col, Statistic, Card } from 'antd';

const { Content } = Layout;

export class AppContent extends Component {
  render() {
    return (
      <Content>
        <div className="mainContent">
          <div className="statsContainer">
            <Card title="Global Stats">
              <Row style={{margin: 0}}>
                <Col span={8}>
                  <Statistic title="Confirmed" value={this.props.totalData.confirmed} />
                </Col>
                <Col span={8}>
                  <Statistic title="Deaths" value={this.props.totalData.deaths} />
                </Col>
                <Col span={8}>
                  <Statistic title="Recovered" value={this.props.totalData.recovered} />
                </Col>
              </Row>
            </Card>
          </div>
          <div className="chartsContainer">
            <Card size="small">
              <HistoryChart data={this.props.selectedData} />
            </Card>
            <Card size="small">
              <EvolutionChart data={this.props.selectedData} />
            </Card>
          </div>
        </div>
      </Content>
    )
  }
}