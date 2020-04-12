import { apiService } from './APIService';

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
    const covidData = await apiService.getLocations();
    console.log(covidData);
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

    covidData.locations.forEach(country => {
      const countryName = country.country;
      if (!countries[countryName]) {
        countries[countryName] = {
          name: countryName,
          coordinates: country.coordinates,
          code: country.country_code,
          updated: country.last_updated,
          confirmed: { provinces: {}, cases: 0, history: {} },
          deaths: { provinces: {}, cases: 0, history: {} },
        };
      }

      countries[countryName].confirmed.cases += country.latest.confirmed;
      countries[countryName].confirmed.history = mergeHistory(
        countries[countryName].confirmed.history,
        country.timelines.confirmed.timeline
      );
      countries[countryName].deaths.cases += country.latest.deaths;
      countries[countryName].deaths.history = mergeHistory(
        countries[countryName].deaths.history,
        country.timelines.deaths.timeline
      );

      if (country.province !== "") {
        countries[countryName].confirmed.provinces[country.province] = {
          name: country.province,
          cases: country.latest.confirmed,
          history: country.timelines.confirmed.timeline
        }
        countries[countryName].deaths.provinces[country.province] = {
          name: country.province,
          cases: country.latest.deaths,
          history: country.timelines.deaths.timeline
        }
      }
    });
    return countries;
  }

  getTotalData(covidData) {
    const updated = this.data.byCountry.US.updated;
    return {
      confirmed: { cases: covidData.latest.confirmed, updated },
      deaths: { cases: covidData.latest.deaths, updated }
    }
  }
}

export const dataManager = new DataManager();