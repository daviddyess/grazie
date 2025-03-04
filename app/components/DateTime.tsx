/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { Box, Tooltip } from '@mantine/core';
import { format as dateFormat, formatDistanceToNow } from 'date-fns';

interface DateTimeProps {
  format?: string;
  timestamp: string | number;
  className?: string;
  fz?: string;
  pl?: number;
  pr?: number;
  pt?: number;
  pb?: number;
  p?: number;
}

export default function DateTime({
  timestamp,
  format = 'yyy-MM-dd h:mm aaa',
  className,
  fz = 'xs',
  ...others
}: DateTimeProps) {
  const str = dateFormat(new Date(timestamp), format);
  return (
    <Box className={className} fz={fz} {...others}>
      {str}
    </Box>
  );
}

export function DateString({
  timestamp,
  format = 'yyy-MM-dd',
  className,
  fz = 'xs',
  ...others
}: DateTimeProps) {
  const str = dateFormat(new Date(timestamp), format);
  return (
    <Box className={className} fz={fz} {...others}>
      {str}
    </Box>
  );
}

export function Time({
  timestamp,
  format = 'h:mm aaa',
  className,
  fz = 'xs',
  ...others
}: DateTimeProps) {
  const str = dateFormat(new Date(timestamp), format);
  return (
    <Box className={className} fz={fz} {...others}>
      {str}
    </Box>
  );
}

export function TimeSince({
  timestamp,
  className,
  fz = 'xs',
  ...others
}: DateTimeProps) {
  const str = formatDistanceToNow(new Date(timestamp));

  return (
    <Tooltip
      inline
      label={<DateTime timestamp={timestamp} />}
      position="left"
      withArrow
    >
      <Box className={className} fz={fz} {...others} component="span">
        {str} ago
      </Box>
    </Tooltip>
  );
}
