/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { getLogger } from '~/utils/logger.server';
const log = getLogger('Data Cache Service');

export class DataCacheService {
  _cached = {};
  _state = {};

  get cached() {
    return this._cached;
  }

  set data(obj) {
    this._cached = {
      ...this._cached,
      ...obj
    };
    if (obj?.initialized) {
      log.info('DataCache initialized');
    }
    // const props = Object.keys(obj);
    // return obj[props[0]];
  }

  set(name, value) {
    this._cached = {
      ...this._cached,
      [name]: value
    };
    return value;
  }

  get(name) {
    return this._cached?.[name];
  }

  update(name, key, value) {
    this._cached = {
      ...this._cached,
      [name]: {
        ...this._cached?.[name],
        [key]: value
      }
    };
    return this._cached[name];
  }

  unset(name) {
    delete this._cached[name];
    return true;
  }
}

export const DataCache = new DataCacheService();

export default DataCache;
