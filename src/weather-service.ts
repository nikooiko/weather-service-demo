import axios, {AxiosInstance} from 'axios';

export interface Locations {
  cities?: string[];
  zipCodes?: number[];
}

export interface ReqParams {
  q?: string;
  zip?: number;
}

export interface Weather {
  location: {
    lat: number;
    lon: number;
  };
  city: string;
  type: string;
  temperature: number;
  humidity: number;
  wind: {
    speed: number;
    degrees: number;
  };
}

export class WeatherService {
  BASE_URL = 'https://api.openweathermap.org/data/2.5';
  instance: AxiosInstance;
  constructor(API_KEY = '363ba8b416a0ebcea2c6204ced0be08f') {
    this.instance = axios.create({
      baseURL: this.BASE_URL,
      params: {
        apiKey: API_KEY,
        units: 'metric',
      },
    });
  }

  async getCurrent(params: ReqParams): Promise<Weather | null> {
    const {data} = await this.instance.get('weather', {params});
    const {
      coord,
      name,
      weather: [{main: type}],
      main,
      wind: {speed, deg},
    } = data;
    const weather: Weather = {
      location: coord,
      city: name,
      type,
      temperature: main.temp,
      humidity: main.humidity,
      wind: {
        speed,
        degrees: deg,
      },
    };
    return weather;
  }
}
