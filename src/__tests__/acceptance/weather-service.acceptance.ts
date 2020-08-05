import {expect} from 'chai'
import {WeatherService} from '../../weather/weather-service'
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
  function givenWeatherEndpoint(
    params: ParsedUrlQuery,
    code: number,
    data?: Body,
  ) {
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
})
