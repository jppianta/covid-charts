import React, { Component } from 'react';
import { Chart } from '@antv/g2';

export class EvolutionChart extends Component {
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateChartSize)
  }

  daysBetweenDates(date1, date2) {
    const timeBetween = date2.getTime() - date1.getTime();
    return timeBetween / (1000 * 60 * 60 * 24);
  }

  updateChartSize = () => {
    const element = document.getElementById('containerEvolution')
    this.chart.changeSize(element.offsetWidth - 10, element.offsetHeight - 10)
  }

  parseData(data) {
    const values = data.map(country => {
      const historyKeys = Object.keys(country.confirmed.history).filter(date => country.confirmed.history[date] > 0);
      historyKeys.sort(function (a, b) {
        a = new Date(a);
        b = new Date(b);
        return a.getTime() - b.getTime();
      });
      const firstDay = new Date(historyKeys[0]);
      return historyKeys.map((date, index) => (
        index === 0 ?
          {
            country: country.name,
            time: 0,
            cases: country.confirmed.history[date]
          } :
          {
            country: country.name,
            time: this.daysBetweenDates(firstDay, new Date(date)),
            cases: country.confirmed.history[date]
          }
      ));
    });
    return [].concat.apply([], values);
  }

  parseDate(date) {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  }

  componentDidUpdate() {
    const data = this.parseData(this.props.data);
    console.log(data);
    this.chart.changeData(data);

    this.chart
      .line()
      .position('time*cases')
      .color('country')
      .shape('smooth');

    this.chart
      .point()
      .position('time*cases')
      .color('country')
      .shape('circle');

    this.chart.tooltip({ showTitle: false })

    this.updateChartSize();
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateChartSize)
    const element = document.getElementById('containerEvolution')
    this.chart = new Chart({
      container: element,
      height: element.offsetHeight - 10,
      autoFit: true,
      padding: 50,
      renderer: 'svg'
    });
    this.chart.tooltip({ showTitle: false })
    this.chart.data(this.parseData(this.props.data));
    this.chart.scale({
      time: {
       sync: true,
       min: 0
      },
      cases: {
        nice: true,
      },
    });

    this.chart.tooltip({
      showCrosshairs: true,
      shared: true,
    });

    this.chart
      .line()
      .position('time*cases')
      .color('country')
      .shape('smooth');

    this.chart
      .point()
      .position('time*cases')
      .color('country')
      .shape('circle');

    this.chart.render();
  }

  render() {
    return (
      <div id="containerEvolution" className="container" />
    );
  }
}

