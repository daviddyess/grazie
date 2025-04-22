/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { randomUUID } from 'crypto';
import { getUnixTime, format as dateFormat } from 'date-fns';
import { getLogger } from '~/utils/logger.server';
import md5 from 'md5';

const log = getLogger('Generic Server Utilities');
/**
 * AWS Storage URL
 */

export const awsServer = `https://${process.env.AWS_S3_BUCKET}.s3-${process.env.AWS_DEFAULT_REGION}.amazonaws.com/`;
/**
 * Get IP Address from Request
 * @param {} req
 * @returns
 */
export function getIpAddress(req) {
  try {
    return (
      (req.headers?.['x-forwarded-for'] || '').split(',').pop().trim() ||
      req?.socket?.remoteAddress
    );
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}
/**
 * Generate Identifier from Request
 * @param {*} req
 * @returns
 */
export function getRequestIdentifier(req) {
  try {
    return md5(`${getIpAddress(req)} + ${req?.headers?.['user-agent']}`);
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}
/**
 * Current Time Stamp
 * @returns Unix Timestamp in Seconds
 */
export const timeStamp = () => {
  try {
    return getUnixTime(Date.now());
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
};

/**
 * Current Time String
 * @returns Date String
 */
export const timeString = () => {
  try {
    const date = new Date(Date.now());

    return date.toISOString();
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
};

/**
 * Formatted Date String
 * @param {*} object { timestamp, format }
 * @returns string
 */
export function dateString({
  timestamp,
  format = undefined
}: {
  timestamp: number;
  format?: string;
}) {
  if (typeof timestamp === 'number') {
    timestamp = timestamp * 1000;
  }

  if (format) {
    return dateFormat(new Date(timestamp), format);
  } else {
    return new Date(timestamp);
  }
}

/**
 * Future Time Stamp
 */
export const futureTime = ({ hours }: { hours: number }) => {
  try {
    const date = new Date(Date.now() + hours * 60 * 60 * 1000);

    return date.toISOString();
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
};

/**
 * Random Number Generator
 * @param {number} length
 * @param {boolean} str
 * @returns number || string
 */
export const randomNumber = (length: number, str = false) => {
  try {
    let min = '1';

    let max = '9';

    let i = 1;

    while (i < length) {
      min += '0';
      max += '0';
      i++;
    }
    const rand = Math.floor(Number(min) + Math.random() * Number(max));

    if (str) {
      return `${rand}`;
    } else {
      return rand;
    }
  } catch (err: any) {
    log.error(err.message);
  }
};

/**
 * Generate UUID
 * @returns string
 */
export const uuid = () => {
  return randomUUID();
};
/**
 * Strip HTML Tags
 * @param {string} value
 * @returns string
 */
export const stripTags = (value: string) => {
  return value.replace(/(<([^>]+)>)/gi, '');
};
/**
 * Generate a Chronologically Sortable String Path
 * @param param0
 * @returns
 */
export const chronoPathGenerator = ({
  id,
  parent
}: {
  id: number;
  parent?: string;
}) => {
  try {
    // Path is an inheritable and sortable string hierarchy of 'timeStamp' + 'id'
    // the initial Path includes the parent Path (if applicable), a new timeStamp, and is then appended by the 'id' portion
    // the 'id' is a string formatted as ("'_key.length'+'_key'") to prevent Path unique conflicts, while retaining sortability
    // this 'id' results in a numeric sortable string, such as 001+1 or 002+10 or 010+1000000000
    // a length limit of 999 digits
    const date = timeString();
    const parentPath = parent ? `${parent}/${date}` : `${date}`;
    const idLength = [...`${id}`].length;
    const zero = '0';
    const prependZeros = `${zero.repeat(3 - 1 - Math.floor(idLength / 10))}`;
    return `${parentPath}(${prependZeros}${idLength}+${id})`;
  } catch (err: any) {
    log.error(err.message);
  }
};

/**
 * Generate a Sortable String Path
 * @param param0
 * @returns
 */
export const pathGenerator = ({
  id,
  name,
  parent
}: {
  id?: number;
  name: string;
  parent?: string;
}) => {
  try {
    // Path is an inheritable and sortable string hierarchy of 'name' or 'name' + 'id'
    // the initial Path includes the parent Path (if applicable), provided string name, and is then appended by the optional 'id' portion
    // the 'id' is a string formatted as ("'_key.length'+'_key'") to prevent Path unique conflicts, while retaining sortability
    // this 'id' results in a numeric sortable string, such as 001+1 or 002+10 or 010+1000000000
    // a length limit of 999 digits
    const path = parent ? `${parent}/${name}` : `${name}`;

    if (!id) {
      return path;
    }

    const idLength = [...`${id}`].length;
    const zero = '0';

    const prependZeros = `${zero.repeat(3 - 1 - Math.floor(idLength / 10))}`;
    return `${path}(${prependZeros}${idLength}+${id})`;
  } catch (err: any) {
    log.error(err.message);
  }
};
