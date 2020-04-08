import React, { Component } from 'react';
import { Layout, Modal, Button } from 'antd';

const { Footer } = Layout;

export class AppFooter extends Component {
  info() {
    Modal.info({
      title: 'Data Disclaimer',
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
      <Footer className="footer">
        <span>
          Made By Joao Pedro Pianta
        </span>
        <Button type="default" onClick={this.info}>
          Data Disclaimer
        </Button>
      </Footer>
    )
  }
}