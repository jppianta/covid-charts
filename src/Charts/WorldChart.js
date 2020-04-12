import React, { Component } from 'react';
import { dataManager } from '../Data/DataManager';
import { scaleSqrt } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import { Tooltip } from 'antd';

export class WorldChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      mostCases: 0
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateChartSize)
  }

  daysBetweenDates(date1, date2) {
    const timeBetween = date2.getTime() - date1.getTime();
    return timeBetween / (1000 * 60 * 60 * 24);
  }

  updateChartSize = () => {
    const element = document.getElementById('worldChart');
    this.chart.changeSize(element.offsetWidth - 10, element.offsetHeight >= 400 ? element.offsetHeight - 10 : 400)
  }

  setData = (data) => {
    const res = {};
    let mostCases = 0;
    Object.values(data.byCountry).forEach(country => {
      res[country.code] = country;
      mostCases = country.confirmed.cases > mostCases ? country.confirmed.cases : mostCases;
    });

    this.setState({ data: res, mostCases });
  }

  componentDidMount() {
    dataManager.addListener(this.setData);
  }

  render() {
    const colorScale = scaleSqrt()
      .domain([0, this.state.mostCases])
      .range(["#fce4ec", "#d32f2f"]);

    return (
      <div className="container" id="worldChart">
        <ComposableMap>
          <ZoomableGroup zoom={1}>
            <Geographies geography="https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json">
              {({ geographies }) =>
                geographies.map(geo => {
                  const country = this.state.data[geo.properties.ISO_A2];
                  const cases = country ? country.confirmed.cases : 0;
                  return (
                    <Tooltip
                      title={`${geo.properties.NAME}: ${cases}`}
                      key={geo.rsmKey}
                    >
                      <Geography
                        stroke="#fafafa"
                        fill={colorScale(cases)}
                        key={geo.rsmKey}
                        geography={geo}
                      />
                    </Tooltip>
                  )
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    );
  }
}

