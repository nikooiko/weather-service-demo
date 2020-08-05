import {expect} from 'chai'
import {WeatherService, Locations} from '../../weather/weather-service'
import nock, {Body} from 'nock'
import {URLSearchParams} from 'url'
import {ParsedUrlQuery} from 'querystring'

describe('Testing Weather Service', () => {
  const weatherService = new WeatherService('testApiKey')
  const validWeather = {
    location: {
      lat: 1,
      lon: 2,
    },
    city: 'cityRes',
    type: 'clear',
    temperature: 20,
    humidity: 60,
    wind: {
      speed: 0.5,
      degrees: 100,
    },
  }
  const validWeatherDto = {
    coord: {lat: 1, lon: 2},
    name: 'cityRes',
    weather: [{main: 'clear'}],
    main: {temp: 20, humidity: 60},
    wind: {speed: 0.5, deg: 100},
  }
  afterEach(() => {
    nock.cleanAll()
  })
  describe('Testing getCurrent', () => {
    it('should retrieve weather', async () => {
      const cityName = 'city'
      givenCityEndpoint(cityName, 200, validWeatherDto)
      const res = await weatherService.getCurrent({q: cityName})
      expect(res).to.eql(validWeather)
    })
    it('should handle request errors', async () => {
      const cityName = 'city'
      givenCityEndpoint(cityName, 400)
      const res = await weatherService.getCurrent({q: cityName})
      expect(res).to.be.null
    })
    it('should handle invalid response errors', async () => {
      const cityName = 'city'
      givenCityEndpoint(cityName, 200, {
        name: 'cityRes',
        weather: [{main: 'clear'}],
        wind: {speed: 0.5, deg: 100},
        // missing some properties (e.g. conditions, location)
      })
      const res = await weatherService.getCurrent({q: cityName})
      expect(res).to.be.null
    })
  })
  describe('Testing getCurrentByCity', () => {
    it('should return the weather using city name', async () => {
      const cityName = 'city'
      givenCityEndpoint(cityName, 200, validWeatherDto)
      const res = await weatherService.getCurrentByCity(cityName)
      expect(res).to.eql(validWeather)
    })
  })
  describe('Testing getCurrentByZip', () => {
    it('should return the weather using zip code', async () => {
      const zip = 123
      givenZipEndpoint(zip, 200, validWeatherDto)
      const res = await weatherService.getCurrentByZip(zip)
      expect(res).to.eql(validWeather)
    })
  })
  describe('Testing getCurrentByLocations', () => {
    it('should return multiple weather data', async () => {
      const cityA = 'cityA'
      const cityB = 'cityB'
      const zipA = 0
      const zipB = 1
      const locations: Locations = {
        cities: [cityA, cityB],
        zipCodes: [zipA, zipB],
      }
      givenCityEndpoint(cityA, 200, {
        ...validWeatherDto,
        name: cityA, // changed name for validation
      })
      givenCityEndpoint(cityB, 400)
      givenZipEndpoint(zipA, 200, {
        ...validWeatherDto,
        weather: undefined, // invalid weather
      })
      givenZipEndpoint(zipB, 200, {
        ...validWeatherDto,
        name: cityB, // changed name for validation
      })
      const weatherData = await weatherService.getCurrentByLocations(locations)
      expect(weatherData).to.eql([
        {...validWeather, city: cityA},
        null, // error 400
        null, // dto validation error
        {...validWeather, city: cityB},
      ])
    })
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function givenWeatherEndpoint(params: any, code: number, data?: Body) {
    nock(weatherService.BASE_URL)
      .get('/weather')
      .query(
        new URLSearchParams({
          ...params,
          ...weatherService.instance.defaults.params,
        }),
      )
      .reply(code, data)
  }
  function givenCityEndpoint(city: string, code: number, data?: Body) {
    givenWeatherEndpoint({q: city}, code, data)
  }
  function givenZipEndpoint(zip: number, code: number, data?: Body) {
    givenWeatherEndpoint({zip}, code, data)
  }
})
