import axios, {AxiosInstance} from 'axios'
import {validateOrReject} from 'class-validator'
import {logger} from '../logger'
import {WeatherDto} from './weather.dto'

export interface Locations {
  cities?: string[]
  zipCodes?: number[]
}

export interface ReqParams {
  q?: string
  zip?: number
}

export interface Weather {
  location: {
    lat: number
    lon: number
  }
  city: string
  type: string
  temperature: number
  humidity: number
  wind: {
    speed: number
    degrees: number
  }
}

export class WeatherService {
  BASE_URL = 'https://api.openweathermap.org/data/2.5'
  instance: AxiosInstance
  constructor(API_KEY = '363ba8b416a0ebcea2c6204ced0be08f') {
    this.instance = axios.create({
      baseURL: this.BASE_URL,
      params: {
        apiKey: API_KEY,
        units: 'metric',
      },
    })
  }

  async getCurrent(params: ReqParams): Promise<Weather | null> {
    let data
    try {
      const res = await this.instance.get('weather', {params})
      data = res.data
      const dto = new WeatherDto()
      Object.assign(dto, data)
      await validateOrReject(dto)
    } catch (err) {
      logger.error('Error with current weather request', {
        type: 'CURRENT_REQ_ERROR',
        err,
        params,
      })
      return null
    }
    const {
      coord,
      name,
      weather: [{main: type}],
      main,
      wind: {speed, deg},
    } = data
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
    }
    return weather
  }

  async getCurrentByCity(city: string): Promise<Weather | null> {
    return this.getCurrent({q: city})
  }

  async getCurrentByZip(zip: number): Promise<Weather | null> {
    return this.getCurrent({zip})
  }

  async getCurrentByLocations(
    locations: Locations,
  ): Promise<(Weather | null)[]> {
    const {zipCodes = [], cities = []} = locations
    const citiesReqs = cities.map((city) => this.getCurrentByCity(city))
    const zipCodesReqs = zipCodes.map((zip) => this.getCurrentByZip(zip))
    return await Promise.all([...citiesReqs, ...zipCodesReqs])
  }
}
