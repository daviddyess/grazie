/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { Fieldset } from '@mantine/core';

export function Debug({
  data,
  label = 'Debug',
  ...others
}: {
  data: object;
  label?: string;
}) {
  return (
    <Fieldset legend={label} mt={10} {...others}>
      <pre>{JSON.stringify({ data }, null, 2)}</pre>
    </Fieldset>
  );
}
