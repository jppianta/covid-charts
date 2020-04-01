import React, { Component } from 'react';
import { Chart } from '@antv/g2';
import DataSet from '@antv/data-set';

export class BarCasesChart extends Component {
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateChartSize)
  }

  daysBetweenDates(date1, date2) {
    const timeBetween = date2.getTime() - date1.getTime();
    return timeBetween / (1000 * 60 * 60 * 24);
  }

  updateChartSize = () => {
    const element = document.getElementById('containerBarCases')
    this.chart.changeSize(element.offsetWidth - 10, element.offsetHeight >= 400 ? element.offsetHeight - 10 : 400)
  }

  parseData(data) {
    return data.map(country => ({
      name: country.name,
      confirmed: country.confirmed.cases,
      deaths: country.deaths.cases,
      recovered: country.recovered.cases
    }));
  }

  componentDidUpdate() {
    const data = this.parseData(this.props.data);
    const ds = new DataSet();
    const dv = ds.createView().source(data);

    dv.transform({
      type: 'fold',
      fields: ['confirmed', 'deaths', 'recovered'],
      key: 'country',
      value: 'cases',
      retains: ['name']
    });

    this.chart.changeData(dv.rows);

    this.chart
      .interval()
      .adjust('stack')
      .position('name*cases')
      .color('country');

    this.chart.tooltip({
      shared: true,
      showMarkers: false,
    });

    this.chart.interaction('active-region');
    this.chart.render();

    this.updateChartSize();
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateChartSize);
    const element = document.getElementById('containerBarCases');

    const ds = new DataSet();
    const dv = ds.createView().source(this.parseData(this.props.data));
    dv.transform({
      type: 'fold',
      fields: ['confirmed', 'deaths', 'recovered'],
      key: 'country',
      value: 'cases',
      retains: ['name']
    });


    this.chart = new Chart({
      container: element,
      height: element.offsetHeight >= 400 ? element.offsetHeight - 10 : 400,
      renderer: 'svg'
    });

    this.chart.coordinate().transpose();

    this.chart.data(dv.rows);
    this.chart.scale('cases', {
      nice: true
    });

    this.chart.axis('name', {
      label: {
        offset: 12,
      },
    });

    this.chart.tooltip({
      shared: true,
      showMarkers: false,
    });


    this.chart.render();

    this.updateChartSize();
  }

  render() {
    return (
      <div id="containerBarCases" className="container" />
    );
  }
}

