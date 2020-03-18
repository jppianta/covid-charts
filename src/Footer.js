import React, { Component } from 'react';
import { Select, Layout } from 'antd';

const { Option } = Select;

const { Footer } = Layout;

export class AppFooter extends Component {
  render() {
    this.props.countries.sort(function (a, b) {
      var nameA = a.name.toUpperCase(); // ignore upper and lowercase
      var nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
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