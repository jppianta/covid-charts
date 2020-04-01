import React, { Component } from 'react';
import { Layout } from 'antd';
import { ChartsContent } from './ChartsContent';
import { StatsContent } from './StatsContent';

const { Content } = Layout;

export class AppContent extends Component {
  render() {
    return (
      <Content className="mainContainer">
        <div className="mainContent">
          <StatsContent />
          <ChartsContent />
        </div>
      </Content>
    )
  }
}