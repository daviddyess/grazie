/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { createContextualCan } from '@casl/react';
import { AbilityContext } from '~/hooks/useAbility';

export const Can = createContextualCan(AbilityContext.Consumer);
