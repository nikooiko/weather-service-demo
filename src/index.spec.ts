import {expect} from 'chai';
import {convertRawLocations} from './';

describe('Testing index methods', () => {
  describe('Testing convertRawLocations', () => {
    it('should convert raw locations', () => {
      expect(convertRawLocations(['New York', '10005'])).to.eql({
        cities: ['New York'],
        zipCodes: [10005],
      });
    });
  });
});
