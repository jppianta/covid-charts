import React, { Component } from 'react';
import { Layout, Spin } from 'antd';
import { ChartsContent } from './ChartsContent';
import { StatsContent } from './StatsContent';
import { dataManager } from '../Data/DataManager';
import { AppFooter } from '../Components/Footer';

const { Content } = Layout;

export class AppContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false
    }

    dataManager.addListener(this.setLoaded);
  }

  setLoaded = () => {
    this.setState({ loaded: true });
  }

  render() {
    return (
      <Content className="mainContainer">
        {
          this.state.loaded ?
            <div className="mainContent">
              <StatsContent />
              <ChartsContent />
              <AppFooter />
            </div> :
            <Spin style={{position: 'absolute', top: '50%'}} />
        }
      </Content>
    )
  }
}