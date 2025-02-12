import { Group, Text, Stack } from '@mantine/core';
import { site as defaultSite } from '@/grazie';
import classes from '~/theme/styles/Footer.module.css';
import { FooterLinks } from '~/components/FooterLinks';
import { SocialIcons } from '~/components/SocialIcons';
import { useTheme } from '~/hooks/useTheme';
import { ColorSchemeToggle } from '~/components/ColorScheme/ColorSchemeToggle';

export function Footer() {
  const {
    data: { site }
  } = useTheme();
  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        <Stack gap="xs">
          <Text fw={500} size="md">
            {site?.name ?? defaultSite?.name ?? 'Site Name'}
          </Text>
          <Text size="xs" c="dimmed">
            Copyright &copy;{' '}
            {site?.copyright ?? defaultSite?.copyright ?? 'Copyright'}
          </Text>
        </Stack>
        <Group className={classes.links}>
          <FooterLinks />
        </Group>
        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <SocialIcons />{' '}
          <ColorSchemeToggle duration={2000} fadeOutDuration={6000} />
        </Group>
      </div>
    </div>
  );
}

export default Footer;
