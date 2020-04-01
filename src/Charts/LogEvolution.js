import React, { Component } from 'react';
import { Chart } from '@antv/g2';

export class LogEvolutionChart extends Component {
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateChartSize)
  }

  daysBetweenDates(date1, date2) {
    const timeBetween = date2.getTime() - date1.getTime();
    return timeBetween / (1000 * 60 * 60 * 24);
  }

  updateChartSize = () => {
    const element = document.getElementById('containerLogEvolution')
    this.chart.changeSize(element.offsetWidth - 10, element.offsetHeight >= 400 ? element.offsetHeight - 10 : 400)
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
            cases: Math.log(country.confirmed.history[date])
          } :
          {
            country: country.name,
            time: this.daysBetweenDates(firstDay, new Date(date)),
            cases: Math.log(country.confirmed.history[date])
          }
      ));
    });
    return [].concat.apply([], values);
  }

  componentDidUpdate() {
    const data = this.parseData(this.props.data);
    this.chart.changeData(data);

    this.chart
      .line()
      .position('time*cases')
      .color('country')
      .shape('smooth');

    this.chart.tooltip({ showTitle: false })

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
    const element = document.getElementById('containerLogEvolution')
    this.chart = new Chart({
      container: element,
      height: element.offsetHeight >= 400 ? element.offsetHeight - 10 : 400,
      renderer: 'svg'
    });
    this.chart.tooltip({ showTitle: false })
    const data = this.parseData(this.props.data);
    this.chart.data(data);
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

    this.chart.scale('time', {
      alias: 'Days since the first case'
    });

    this.chart.axis('time', {
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

    this.updateChartSize();
  }

  render() {
    return (
      <div id="containerLogEvolution" className="container" />
    );
  }
}

