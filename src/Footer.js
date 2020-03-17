import React, { Component } from 'react';
import { Select, Layout } from 'antd';

const { Option } = Select;

const { Footer } = Layout;

export class AppFooter extends Component {
  render() {
    return (
      <Footer>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Please select"
          defaultValue={[]}
          onChange={this.props.onChange}
        >
          {
            this.props.countries.map(country => <Option key={country.name}>{country.name}</Option>)
          }
        </Select>
      </Footer>
    )
  }
}