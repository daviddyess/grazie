/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { ActionIcon, rem } from '@mantine/core';
import { Link } from 'react-router';
import {
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandInstagram,
  IconBrandGithub
} from '@tabler/icons-react';
import { useTheme } from '~/hooks/useTheme';

export type SocialIconsProps = {
  links?: {
    twitter: string;
    youtube: string;
    instagram: string;
    github: [string] | string;
  };
};

export const SocialIcons = ({ links }: SocialIconsProps) => {
  const {
    data: {
      footer: { social }
    }
  } = useTheme();

  const { twitter, youtube, instagram, github } = links ?? social ?? {};

  return (
    <>
      {twitter && (
        <ActionIcon
          component={Link}
          size="lg"
          variant="default"
          radius="xl"
          to={twitter}
        >
          <IconBrandTwitter
            style={{ width: rem(18), height: rem(18) }}
            stroke={1.5}
          />
        </ActionIcon>
      )}
      {youtube && (
        <ActionIcon
          component={Link}
          size="lg"
          variant="default"
          radius="xl"
          to={youtube}
        >
          <IconBrandYoutube
            style={{ width: rem(18), height: rem(18) }}
            stroke={1.5}
          />
        </ActionIcon>
      )}
      {instagram && (
        <ActionIcon
          component={Link}
          size="lg"
          variant="default"
          radius="xl"
          to={instagram}
        >
          <IconBrandInstagram
            style={{ width: rem(18), height: rem(18) }}
            stroke={1.5}
          />
        </ActionIcon>
      )}
      {github && (
        <ActionIcon
          component={Link}
          size="lg"
          variant="default"
          radius="xl"
          to={github}
        >
          <IconBrandGithub
            style={{ width: rem(18), height: rem(18) }}
            stroke={1.5}
          />
        </ActionIcon>
      )}
    </>
  );
};
