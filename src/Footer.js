import React, { Component } from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

export class AppFooter extends Component {
  render() {
    return (
      <Footer className="footer">
        Made By Joao Pedro Pianta
      </Footer>
    )
  }
}