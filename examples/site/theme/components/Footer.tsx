import { Anchor, Group, ActionIcon, rem, Text } from '@mantine/core';
import {
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandInstagram
} from '@tabler/icons-react';
import { site } from '@/grazie';
import classes from '!~/theme/styles/Footer.module.css';
import { useTheme } from '~/hooks/useTheme';

export function Footer() {
  const {
    data: {
      footer: { links },
      site
    }
  } = useTheme();

  const items = links.map((link) => (
    <Anchor c="dimmed" key={link.label} href={link.to} lh={1} size="sm">
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        <Text fw={500} size="md">
          {site?.name ?? 'Site Name'}
        </Text>
        <Group className={classes.links}>{items}</Group>
        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandTwitter
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandYoutube
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandInstagram
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
        </Group>
      </div>
    </div>
  );
}

export default Footer;
