import React, { Component } from 'react';
import DataSet from '@antv/data-set';
import { Chart } from '@antv/g2';
import * as worldData from './world.geo.json'

export class GlobeChart extends Component {
  componentDidMount() {
    window.addEventListener('resize', this.updateChartSize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateChartSize)
  }

  updateChartSize = () => {
    const element = document.getElementById('containerGlobe')
    this.chart.changeSize(element.offsetWidth - 10, element.offsetHeight - 10)
  }

  componentDidUpdate() {
    const mapData = worldData.default;
    const confirmedLocations = this.props.data;
    const element = document.getElementById('containerGlobe')

    this.chart = new Chart({
      container: 'containerGlobe',
      height: element.offsetHeight - 10,
      width: element.offsetWidth - 10,
      padding: [0, 20, 40]
    });
    // force sync scales
    this.chart.scale({
      x: { sync: true },
      y: { sync: true }
    });
    this.chart.coordinate('rect').reflect('y');
    this.chart.legend(false);
    this.chart.axis(false);

    // data set
    const ds = new DataSet();

    // draw the map
    const dv = ds.createView('back')
      .source(mapData, {
        type: 'GeoJSON'
      })
      .transform({
        type: 'geo.projection',
        projection: 'geoMercator',
        as: ['x', 'y', 'centroidX', 'centroidY']
      });
    const bgView = this.chart.createView();
    bgView.data(dv.rows);
    bgView.tooltip(false);
    bgView.polygon()
      .position('x*y')
      .style({
        fill: '#DDDDDD',
        stroke: '#b1b1b1',
        lineWidth: 0.5,
        fillOpacity: 0.85
      });

    // draw the bubble plot
    const userData = ds.createView().source(confirmedLocations);
    userData.transform({
      type: 'map',
      callback: obj => {
        const projectedCoord = dv.geoProjectPosition([obj.coordinates.long, obj.coordinates.lat], 'geoMercator');
        obj.x = projectedCoord[0];
        obj.y = projectedCoord[1];
        obj.deaths = obj.latest;
        return obj;
      }
    });
    const pointView = this.chart.createView();
    this.chart.tooltip({ showTitle: false })
    pointView.data(userData.rows);
    pointView.point()
      .position('x*y')
      .size('deaths', [2, 30])
      .shape('circle')
      .color('#FF2F29')
      .tooltip('country*deaths')
      .style({
        fillOpacity: 0.45,
      })
      .state({
        active: {
          style: {
            lineWidth: 1,
            stroke: '#FF2F29'
          }
        }
      });
    pointView.interaction('element-active');
    this.chart.render();
  }

  render() {
    return (
      <div id="containerGlobe" className="container" />
    );
  }
}

