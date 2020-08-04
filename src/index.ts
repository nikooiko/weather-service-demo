import {logger} from './logger';

const {argv} = process;
const locations = argv.slice(2);
if (!locations.length) {
  logger.error('Missing locations', {type: 'MISSING_LOCATION_ARGS'});
  process.exit(1);
}
logger.info('Will provide weather for locations', {
  type: 'TARGET_LOCATIONS',
  locations,
});
