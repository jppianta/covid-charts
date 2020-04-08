class APIService {
  constructor() {
    this.baseURL = 'https://coronavirus-tracker-api.herokuapp.com/v2'
  }

  async getLocations() {
    const response = await fetch(`${this.baseURL}/locations?timelines=1`);
    return await response.json();
  }
}

export const apiService = new APIService();