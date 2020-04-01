import React, { Component } from 'react';
import { Layout } from 'antd';
import './App.css';
import { AppHeader } from './Header';
import { AppContent } from './Content/Content';
import { dataManager } from './DataManager';

class App extends Component {
  componentDidMount() {
    dataManager.pullData();
  }

  render() {
    return (
      <div className="App">
        <Layout className="App">
          <AppHeader />
          <AppContent />
        </Layout>
      </div>
    );
  }
}

export default App;


