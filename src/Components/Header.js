import React, { Component } from 'react';
import { Layout } from 'antd';
import covidLogo from '../Assets/Covid-19-Charts.png';

const { Header } = Layout;

export class AppHeader extends Component {


  render() {
    return (
      <Header className="header">
        <div className="headerContainer">
          <div className="logoContainer">
            <img className="header-title" src={covidLogo} alt="Covid Logo" />
          </div>
        </div>
      </Header>
    )
  }
}