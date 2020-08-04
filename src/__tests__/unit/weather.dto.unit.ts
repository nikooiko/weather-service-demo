import {WeatherDto} from '../../weather/weather.dto';
import {transformAndValidate} from 'class-transformer-validator';

describe('Testing Weather Dto', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function validate(data: any): Promise<void> {
    await transformAndValidate(WeatherDto, data);
  }
  it('should accept valid data', async () => {
    await validate({
      coord: {lat: 1, lon: 2},
      name: 'cityRes',
      weather: [{main: 'clear'}],
      main: {temp: 20, humidity: 60},
      wind: {speed: 0.5, deg: 100},
    });
  });
  it('should deny invalid coord', async () => {
    return Promise.all([
      validate({
        // missing coord: {lat: 1, lon: 2},
        name: 'cityRes',
        weather: [{main: 'clear'}],
        main: {temp: 20, humidity: 60},
        wind: {speed: 0.5, deg: 100},
      }).should.be.rejected,
      validate({
        coord: {lon: 2}, // missing lat
        name: 'cityRes',
        weather: [{main: 'clear'}],
        main: {temp: 20, humidity: 60},
        wind: {speed: 0.5, deg: 100},
      }).should.be.rejected,
      validate({
        coord: {lat: 2}, // missing lon
        name: 'cityRes',
        weather: [{main: 'clear'}],
        main: {temp: 20, humidity: 60},
        wind: {speed: 0.5, deg: 100},
      }).should.be.rejected,
      validate({
        coord: {lon: 'invalid', lat: 2},
        name: 'cityRes',
        weather: [{main: 'clear'}],
        main: {temp: 20, humidity: 60},
        wind: {speed: 0.5, deg: 100},
      }).should.be.rejected,
      validate({
        coord: {lon: 1, lat: 'invalid'},
        name: 'cityRes',
        weather: [{main: 'clear'}],
        main: {temp: 20, humidity: 60},
        wind: {speed: 0.5, deg: 100},
      }).should.be.rejected,
    ]);
  });
  it('should deny invalid name', async () => {
    return Promise.all([
      validate({
        coord: {lat: 1, lon: 2},
        // missing name: 'cityRes',
        weather: [{main: 'clear'}],
        main: {temp: 20, humidity: 60},
        wind: {speed: 0.5, deg: 100},
      }).should.be.rejected,
      validate({
        coord: {lat: 1, lon: 2},
        name: 312, // invalid
        weather: [{main: 'clear'}],
        main: {temp: 20, humidity: 60},
        wind: {speed: 0.5, deg: 100},
      }).should.be.rejected,
    ]);
  });
  it('should deny invalid weatherObj', async () => {
    return Promise.all([
      validate({
        coord: {lat: 1, lon: 2},
        name: 'cityRes',
        // missing weather: [{main: 'clear'}],
        main: {temp: 20, humidity: 60},
        wind: {speed: 0.5, deg: 100},
      }).should.be.rejected,
      validate({
        coord: {lat: 1, lon: 2},
        name: 'cityRes',
        weather: [{}], // missing main
        main: {temp: 20, humidity: 60},
        wind: {speed: 0.5, deg: 100},
      }).should.be.rejected,
      validate({
        coord: {lat: 1, lon: 2},
        name: 'cityRes',
        weather: [{main: 123}], // invalid main
        main: {temp: 20, humidity: 60},
        wind: {speed: 0.5, deg: 100},
      }).should.be.rejected,
    ]);
  });
  it('should deny invalid conditions', async () => {
    return Promise.all([
      validate({
        coord: {lat: 1, lon: 2},
        name: 'cityRes',
        weather: [{main: 'clear'}],
        // missing main: {temp: 20, humidity: 60},
        wind: {speed: 0.5, deg: 100},
      }).should.be.rejected,
      validate({
        coord: {lat: 1, lon: 2},
        name: 'cityRes',
        weather: [{main: 'clear'}],
        main: {humidity: 60}, // missing temp
        wind: {speed: 0.5, deg: 100},
      }).should.be.rejected,
      validate({
        coord: {lat: 1, lon: 2},
        name: 'cityRes',
        weather: [{main: 'clear'}],
        main: {temp: 20}, // missing humidity
        wind: {speed: 0.5, deg: 100},
      }).should.be.rejected,
      validate({
        coord: {lat: 1, lon: 2},
        name: 'cityRes',
        weather: [{main: 'clear'}],
        main: {temp: 'invalid', humidity: 100},
        wind: {speed: 0.5, deg: 100},
      }).should.be.rejected,
      validate({
        coord: {lat: 1, lon: 2},
        name: 'cityRes',
        weather: [{main: 'clear'}],
        main: {temp: 20, humidity: 'invalid'},
        wind: {speed: 0.5, deg: 100},
      }).should.be.rejected,
    ]);
  });
  it('should deny invalid wind', async () => {
    return Promise.all([
      validate({
        coord: {lat: 1, lon: 2},
        name: 'cityRes',
        weather: [{main: 'clear'}],
        main: {temp: 20, humidity: 60},
        // missing wind: {speed: 0.5, deg: 100},
      }).should.be.rejected,
      validate({
        coord: {lat: 1, lon: 2},
        name: 'cityRes',
        weather: [{main: 'clear'}],
        main: {temp: 20, humidity: 60},
        wind: {deg: 100}, // missing speed
      }).should.be.rejected,
      validate({
        coord: {lat: 1, lon: 2},
        name: 'cityRes',
        weather: [{main: 'clear'}],
        main: {temp: 20, humidity: 60},
        wind: {speed: 0.5}, // missing deg
      }).should.be.rejected,
      validate({
        coord: {lat: 1, lon: 2},
        name: 'cityRes',
        weather: [{main: 'clear'}],
        main: {temp: 20, humidity: 60},
        wind: {speed: 'invalid', deg: 100},
      }).should.be.rejected,
      validate({
        coord: {lat: 1, lon: 2},
        name: 'cityRes',
        weather: [{main: 'clear'}],
        main: {temp: 20, humidity: 60},
        wind: {speed: 0.5, deg: 'invalid'},
      }).should.be.rejected,
    ]);
  });
});
