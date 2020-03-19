import React, { Component } from 'react';
import { Chart } from '@antv/g2';

export class HistoryChart extends Component {
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateChartSize)
  }

  updateChartSize = () => {
    const element = document.getElementById('containerHistory')
    this.chart.changeSize(element.offsetWidth - 10, element.offsetHeight >= 400 ? element.offsetHeight - 10 : 400)
  }

  parseData(data) {
    const values = data.map(country => {
      return Object.keys(country.confirmed.history).map(date => (
        { country: country.name, date: new Date(date), cases: country.confirmed.history[date] }
      ));
    });
    return [].concat.apply([], values);
  }

  parseDate(date) {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  }

  componentDidUpdate() {
    const data = this.parseData(this.props.data);
    this.chart.changeData(data);

    this.chart
      .line()
      .position('date*cases')
      .color('country')
      .shape('smooth');

    this.chart
      .point()
      .position('date*cases')
      .color('country')
      .shape('circle');

    this.chart.tooltip({ showTitle: false });

    let highestNumberOfCases = 0;

    data.forEach(d => {
      highestNumberOfCases = d.cases > highestNumberOfCases ? d.cases : highestNumberOfCases;
    });

    this.chart.scale('cases', {
      alias: 'Number of cases',
      max: highestNumberOfCases + 0.2 * highestNumberOfCases
    });

    this.chart.render();

    this.updateChartSize();
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateChartSize)
    const element = document.getElementById('containerHistory')
    this.chart = new Chart({
      container: element,
      height: element.offsetHeight >= 400 ? element.offsetHeight - 10 : 400,
      renderer: 'svg'
    });
    this.chart.tooltip({ showTitle: false })
    this.chart.data(this.parseData(this.props.data));
    this.chart.scale({
      date: {
        range: [0, 1],
      },
      cases: {
        nice: true,
      },
    });

    this.chart.tooltip({
      showCrosshairs: true,
      shared: true,
    });

    this.chart.scale('date', {
      alias: 'Date (mm/dd/yyyy)'
    });

    this.chart.axis('date', {
      label: {
        formatter: (val) => {
          const date = new Date(Number(val));
          return this.parseDate(date);
        }
      },
      title: {
        offset: 20,
        style: {
          fill: '#aaa'
        }
      }
    });

    this.chart.scale('cases', {
      alias: 'Number of cases'
    });

    this.chart.axis('cases', {
      title: {
        offset: 20,
        style: {
          fill: '#aaa'
        }
      }
    });

    this.chart
      .line()
      .position('date*cases')
      .color('country')
      .shape('smooth');

    this.chart
      .point()
      .position('date*cases')
      .color('country')
      .shape('circle');

    this.chart.render();
    this.updateChartSize();
  }

  render() {
    return (
      <div id="containerHistory" className="container" />
    );
  }
}

