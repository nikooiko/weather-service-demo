import {logger} from './logger';
import {Locations} from './weather-service';

export function parseArgs(): string[] {
  // extract raw locations (city names, zip codes) from process arguments
  const {argv} = process;
  const rawLocations = argv.slice(2);
  if (!rawLocations.length) {
    logger.error('Missing locations', {type: 'MISSING_LOCATION_ARGS'});
    process.exit(1);
  }
  return rawLocations;
}

export function convertRawLocations(rawLocations: string[]): Locations {
  // try to group raw locations into known parseable categories
  const locations = rawLocations.reduce(
    (res: {cities: string[]; zipCodes: number[]}, raw) => {
      const possibleZipCode = parseInt(raw);
      if (Number.isFinite(possibleZipCode)) {
        res.zipCodes.push(possibleZipCode);
      } else {
        // if not number (aka zip code) expect location to be a city name
        res.cities.push(raw);
      }
      return res;
    },
    {cities: [], zipCodes: []},
  );
  logger.debug('Will provide weather for locations', {
    type: 'TARGET_LOCATIONS',
    locations,
  });
  return locations;
}

if (require.main === module) {
  convertRawLocations(parseArgs());
}
