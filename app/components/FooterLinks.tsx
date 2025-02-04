/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { subject, useAbility } from '~/hooks/useAbility';
import { Link } from 'react-router';
import { useTheme } from '~/hooks/useTheme';
import { Fragment } from 'react/jsx-runtime';
import { Anchor } from '@mantine/core';

export function FooterLinks() {
  const {
    data: { footer, navbar }
  } = useTheme();
  const ability = useAbility();
  const { links } = footer ?? navbar ?? { links: [] };
  return (
    Array.isArray(links) &&
    links?.length > 0 && (
      <>
        {links?.map((link, index) => (
          <Fragment key={`footer-link-${index}`}>
            {link?.ability ? (
              <>
                {ability.can(
                  link.ability.action,
                  subject(link.ability.subject, link?.ability?.item ?? {})
                ) && (
                  <Anchor
                    component={Link}
                    c="dimmed"
                    key={link.label}
                    to={link.to}
                    lh={1}
                    size="sm"
                  >
                    {link.label}
                  </Anchor>
                )}
              </>
            ) : (
              <Anchor
                component={Link}
                c="dimmed"
                key={link.label}
                to={link.to}
                lh={1}
                size="sm"
              >
                {link.label}
              </Anchor>
            )}
          </Fragment>
        ))}
      </>
    )
  );
}
