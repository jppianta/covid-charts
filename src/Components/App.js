import React, { Component } from 'react';
import { Layout } from 'antd';
import '../Style/Components/App.scss';
import { AppContent } from '../Content/Content';
import { dataManager } from '../Data/DataManager';

class App extends Component {
  componentDidMount() {
    dataManager.pullData();
  }

  render() {
    return (
      <div className="App">
        <Layout className="App">
          <AppContent />
        </Layout>
      </div>
    );
  }
}

export default App;


