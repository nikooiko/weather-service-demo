import {expect} from 'chai';
import {WeatherService} from '../../weather-service';
import nock from 'nock';
import {URLSearchParams} from 'url';

describe('Testing Weather Service', () => {
  describe('Testing getCurrent', () => {
    const weatherService = new WeatherService('testApiKey');
    after(() => {
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
  });
});
