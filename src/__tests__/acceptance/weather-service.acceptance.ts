import {expect} from 'chai';
import {WeatherService} from '../../weather-service';
import nock from 'nock';
import {URLSearchParams} from 'url';

describe('Testing Weather Service', () => {
  describe('Testing getCurrent', () => {
    const weatherService = new WeatherService('testApiKey');
    afterEach(() => {
      nock.cleanAll();
    });
    it('should retrieve weather', async () => {
      const cityName = 'city';
      nock(weatherService.BASE_URL)
        .get('/weather')
        .query(
          new URLSearchParams({
            q: cityName,
            ...weatherService.instance.defaults.params,
          }),
        )
        .reply(200, {
          coord: {lat: 1, lon: 2},
          name: 'cityRes',
          weather: [{main: 'clear'}],
          main: {temp: 20, humidity: 60},
          wind: {speed: 0.5, deg: 100},
        });
      const res = await weatherService.getCurrent({q: cityName});
      expect(res).to.eql({
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
      });
    });
    it('should handle request errors', async () => {
      nock(weatherService.BASE_URL);
      const res = await weatherService.getCurrent({q: 'something'});
      expect(res).to.be.null;
    });
    it('should handle invalid response errors', async () => {
      const cityName = 'city';
      nock(weatherService.BASE_URL)
        .get('/weather')
        .query(
          new URLSearchParams({
            q: cityName,
            ...weatherService.instance.defaults.params,
          }),
        )
        .reply(200, {
          name: 'cityRes',
          weather: [{main: 'clear'}],
          wind: {speed: 0.5, deg: 100},
          // missing some properties (e.g. city, location)
        });
      nock(weatherService.BASE_URL);
      const res = await weatherService.getCurrent({q: cityName});
      expect(res).to.be.null;
    });
  });
});
