import covidDataApi from 'jhucsse.covid';

class DataManager {
  constructor() {
    this.data = {}

    this.listeners = [];
  }

  addListener(callback) {
    this.listeners.push(callback);
    if (Object.values(this.data).length > 0) {
      callback(this.data);
    }
  }

  async pullData() {
    const covidData = await covidDataApi.all();
    this.data.byCountry = this.parseDataByCountry(covidData);
    this.data.total = this.getTotalData(covidData);
    this.listeners.forEach(callback => callback(this.data));
  }

  parseDataByCountry(covidData) {
    const countries = {};
    function mergeHistory(history1, history2) {
      Object.keys(history2).forEach(key => history1[key] = (history1[key] || 0) + history2[key])
      return history1;
    }

    function parseData(data, type) {
      data.locations.forEach(location => {
        if (!countries[location.country]) {
          countries[location.country] = {
            name: location.country,
            coordinates: location.coordinates,
            confirmed: { provinces: {}, cases: 0, history: {} },
            deaths: { provinces: {}, cases: 0, history: {} },
            recovered: { provinces: {}, cases: 0, history: {} }
          }
        }

        const typeMap = countries[location.country][type];

        typeMap.cases += location.latest;
        typeMap.history = mergeHistory(typeMap.history, location.history);

        if (location.province !== "") {
          typeMap.provinces[location.province] = {
            name: location.province,
            cases: location.latest,
            history: location.history
          }
        }
      });
    }

    parseData(covidData.confirmed, 'confirmed');
    parseData(covidData.deaths, 'deaths');
    parseData(covidData.recovered, 'recovered');
    return countries;
  }

  getTotalData(covidData) {
    return {
      confirmed: { cases: covidData.confirmed.latest, updated: covidData.confirmed.last_updated },
      deaths: { cases: covidData.deaths.latest, updated: covidData.deaths.last_updated },
      recovered: { cases: covidData.recovered.latest, updated: covidData.recovered.last_updated }
    }
  }
}

export const dataManager = new DataManager();