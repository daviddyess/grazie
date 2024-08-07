/**
 * Grazie
 * @package Sentry Library
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { subject as Subject } from '@casl/ability';
import { status } from './error.server';
import { getSession } from '~/utils/session.server';
/**
 * Sentry Access Control
 * @param request
 * @param param1
 * @param param2
 * @returns boolean | http status 404
 */
export async function sentry(
  request: Request,
  {
    action,
    subject,
    item = {},
    items
  }: { action: string; subject: string; item?: object; items?: any[] },
  { reject = true } = {}
) {
  if (Array.isArray(items)) {
    for (const item of items) {
      if (item?.owner) {
        const session = await getSession(request.headers.get('Cookie'));
        item[item.owner] = session.get('userId') as number;
      }
      if (!request.ability.can(action, Subject(subject, item))) {
        if (reject) {
          return status(404);
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
  } else {
    if (item?.owner) {
      const session = await getSession(request.headers.get('Cookie'));
      item[item.owner] = session.get('userId') as number;
    }
    if (!request.ability.can(action, Subject(subject, item))) {
      if (reject) {
        return status(404);
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
}
