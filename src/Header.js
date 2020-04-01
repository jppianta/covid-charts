import React, { Component } from 'react';
import { Layout, Modal, Button } from 'antd';
import { InfoOutlined } from '@ant-design/icons';
import covidLogo from './Assets/Covid-19-Charts.png';

const { Header } = Layout;

export class AppHeader extends Component {
  info() {
    Modal.info({
      title: 'Info',
      content: (
        <div>
          <p>Page that aims to help people to analyze data about covid-19.</p>
          <p>All information comes from the <a href="https://github.com/CSSEGISandData/COVID-19" target="blank">  2019 Novel Coronavirus COVID-19 (2019-nCoV) Data Repository.</a></p>
        </div>
      ),
      onOk() { },
    });
  }

  render() {
    return (
      <Header className="header">
        <div className="headerContainer">
          <div className="logoContainer">
            <img className="header-title" src={covidLogo} alt="Covid Logo" />
          </div>
          <Button type="default" shape="circle" onClick={this.info}>
            <InfoOutlined />
          </Button>
        </div>
      </Header>
    )
  }
}