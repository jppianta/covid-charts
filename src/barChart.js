import React, { Component } from 'react';
import { Chart } from '@antv/g2';

export class BarChart extends Component {
  componentDidMount() {
    window.addEventListener('resize', this.updateChartSize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateChartSize)
  }

  updateChartSize = () => {
    const element = document.getElementById('containerBar')
    this.chart.changeSize(element.offsetWidth - 10, element.offsetHeight - 10)
  }

  componentDidUpdate() {
    const element = document.getElementById('containerBar')
    this.chart = new Chart({
      container: element,
      height: element.offsetHeight - 10,
      width: element.offsetWidth - 10,
    });
    this.props.data.sort(function (a, b) { return a.value - b.value })
    console.log(this.props.data)
    this.chart.data(this.props.data);
    this.chart.scale({
      value: {
        max: 100000,
        min: 0
      },
    });
    this.chart.axis('type', {
      title: null,
      tickLine: null,
      line: null,
    });

    this.chart.axis('value', {
      label: null,
      title: {
        offset: 30,
        style: {
          fontSize: 12,
          fontWeight: 300,
        },
      },
    });
    this.chart.legend(false);
    this.chart.coordinate().transpose();
    this.chart
      .interval()
      .position('type*value')
      .size(26)
      .label('value', {
        style: {
          fill: '#8d8d8d',
        },
        offset: 10,
      });
    this.chart.interaction('element-active');
    this.chart.render();
  }

  render() {
    return (
      <div id="containerBar" className="container" />
    );
  }
}

