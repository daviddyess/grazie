/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { Fragment } from 'react/jsx-runtime';
import { Link } from '@remix-run/react';
import { subject, useAbility } from '~/hooks/useAbility';
import { useTheme } from '~/hooks/useTheme';
import useUser from '~/hooks/useUser';

function abilityItemVars(item: any, user: any) {
  if (typeof item === 'object') {
    for (const [key, value] of Object.entries(item)) {
      if (value === '{authorId}' || value === '{userId}') {
        item[key] = user.id;
      }
    }
  }
  return item;
}

export function NavLinks({ className = undefined }: { className?: string }) {
  const {
    data: { navbar }
  } = useTheme();
  const ability = useAbility();
  const { links } = navbar ?? { links: [] };
  const user = useUser();

  return (
    Array.isArray(links) &&
    links?.length > 0 && (
      <>
        {links?.map((navlink, index) => (
          <Fragment key={`navlink-${index}`}>
            {navlink?.ability ? (
              <>
                {ability.can(
                  navlink.ability.action,
                  subject(
                    navlink.ability.subject,
                    abilityItemVars(navlink?.ability?.item, user) ?? {}
                  )
                ) && (
                  <Link to={navlink.to} className={className}>
                    {navlink.label}
                  </Link>
                )}
              </>
            ) : (
              <Link
                key={`navlink-${index}`}
                to={navlink.to}
                className={className}
              >
                {navlink.label}
              </Link>
            )}
          </Fragment>
        ))}
      </>
    )
  );
}
