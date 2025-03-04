import {
  Anchor,
  Avatar,
  Box,
  Burger,
  Button,
  Center,
  Collapse,
  Divider,
  Drawer,
  Group,
  Menu,
  rem,
  ScrollArea,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
  useMantineTheme
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useLocation, useNavigate, type To } from 'react-router';
import {
  IconChevronDown,
  IconFriends,
  IconHeart,
  IconLogin,
  IconLogout,
  IconMessage,
  IconSettings,
  IconStar,
  IconSwitchHorizontal,
  IconUserPlus,
  IconDashboard,
  IconBookmarkFilled,
  IconHeartFilled
} from '@tabler/icons-react';
import cx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import useUser from '~/hooks/useUser';
import classes from '~/theme/styles/Header.module.css';
import { useTheme } from '~/hooks/useTheme';
import { NavLinks } from '~/components/NavLinks';
import { site as defaultSite } from '@/grazie';

const userMenuData = [
  {
    icon: IconHeart,
    title: 'Liked posts',
    to: '/posts/favorites'
  },
  {
    icon: IconStar,
    title: 'Saved posts',
    to: '/posts/bookmarks'
  },
  {
    icon: IconMessage,
    title: 'My Comments',
    to: '/posts/comments'
  },
  {
    icon: IconFriends,
    title: 'Dashboard',
    to: '/dashboard'
  },
  {
    icon: IconSettings,
    title: 'Account Settings',
    to: '/dashboard/account'
  },
  {
    icon: IconLogout,
    title: 'Logout',
    to: '/logout'
  }
];

export function Header({ handle }: { handle?: React.ReactNode }) {
  const navigate = useNavigate();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [userLinksOpened, { toggle: toggleUserLinks }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const user = useUser();
  const isLoggedIn = user?.isLoggedIn ?? false;
  const username = user?.username ?? 'Guest';
  const theme = useMantineTheme();
  const {
    data: { navbar, site }
  } = useTheme();
  // User Menu items in the responsive drawer
  const userLinks = userMenuData.map((item) => (
    <UnstyledButton
      className={classes.subLink}
      key={item.title}
      onClick={item?.to ? () => navigate(item.to) : () => null}
    >
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon
            style={{ width: rem(22), height: rem(22) }}
            color={theme.colors.blue[6]}
          />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  const location = useLocation();
  const locationRef = useRef(location.key);
  // Close the drawer when the location changes
  useEffect(() => {
    if (locationRef.current !== location.key) {
      locationRef.current = location.key;
      if (drawerOpened) {
        toggleDrawer();
      }
    }
  }, [drawerOpened, location.key]);

  return (
    <>
      <Group justify="space-between" h="100%" px="xs">
        {handle}
        <Anchor component={Link} to="/" underline="never">
          <Title order={1} size="1.50rem">
            {site?.name ?? defaultSite?.name ?? 'Site Name'}
          </Title>
        </Anchor>
        <Group h="100%" gap={0} visibleFrom="sm">
          <Link to="/" className={classes.link}>
            Home
          </Link>
          <NavLinks className={classes.link} />
        </Group>
        <Menu
          width={260}
          position="bottom-end"
          transitionProps={{ transition: 'pop-top-right' }}
          onClose={() => setUserMenuOpened(false)}
          onOpen={() => setUserMenuOpened(true)}
          withinPortal
        >
          <Menu.Target>
            <UnstyledButton
              className={cx(classes.user, {
                [classes.userActive]: userMenuOpened
              })}
            >
              <Group gap={7}>
                <Avatar
                  src={user?.avatar?.sm}
                  alt={username}
                  radius="xl"
                  size={30}
                />
                <Text fw={500} size="sm" style={{ lineHeight: 1 }} mr={3}>
                  {username}
                </Text>
                <IconChevronDown size={22} stroke={1.5} />
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            {isLoggedIn ? (
              <>
                <Menu.Item
                  leftSection={
                    <IconHeartFilled
                      size={22}
                      color={theme.colors.red[6]}
                      stroke={1.5}
                    />
                  }
                  onClick={() => navigate('/posts/favorites')}
                >
                  Favorite Posts
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconBookmarkFilled
                      size={22}
                      color={theme.colors.yellow[6]}
                      stroke={1.5}
                    />
                  }
                  onClick={() => navigate('/posts/bookmarks')}
                >
                  Saved Posts
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconMessage
                      size={22}
                      color={theme.colors.blue[6]}
                      stroke={1.5}
                    />
                  }
                >
                  Your Comments
                </Menu.Item>
                <Menu.Divider />
                <Menu.Label>Content</Menu.Label>
                <Menu.Item
                  leftSection={<IconDashboard size={22} stroke={1.5} />}
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </Menu.Item>
                <Menu.Divider />
                <Menu.Label>Account</Menu.Label>
                <Menu.Item
                  leftSection={<IconSettings size={22} stroke={1.5} />}
                  onClick={() => navigate('/dashboard/account')}
                >
                  Account Settings
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<IconLogout size={22} stroke={1.5} />}
                  onClick={() => navigate('/logout')}
                >
                  Logout
                </Menu.Item>
              </>
            ) : (
              <>
                <Menu.Item
                  leftSection={<IconLogin size={22} stroke={1.5} />}
                  onClick={() => navigate('/login')}
                >
                  Login
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<IconUserPlus size={22} stroke={1.5} />}
                  onClick={() => navigate('/register')}
                >
                  Register
                </Menu.Item>
              </>
            )}
          </Menu.Dropdown>
        </Menu>
        <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
      </Group>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title={site?.name ?? defaultSite?.name ?? 'Site Name'}
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />
          <Link to="/" className={classes.link}>
            Home
          </Link>
          {navbar?.links?.map((link: { to: To; label: string }, index: any) => (
            <Link
              key={`navlink-${index}`}
              to={link.to}
              className={classes.link}
            >
              {link.label}
            </Link>
          ))}
          <Divider my="sm" />
          {isLoggedIn ? (
            <>
              <UnstyledButton
                className={classes.link}
                onClick={toggleUserLinks}
              >
                <Center inline>
                  <Box component="span" mr={5}>
                    {username}
                  </Box>
                  <IconChevronDown
                    style={{ width: rem(18), height: rem(18) }}
                    color={theme.colors.blue[6]}
                  />
                </Center>
              </UnstyledButton>
              <Collapse in={userLinksOpened}>{userLinks}</Collapse>
            </>
          ) : (
            <Group justify="center" grow pb="xl" px="md">
              <Button variant="default" onClick={() => navigate('/login')}>
                Log in
              </Button>
              <Button onClick={() => navigate('/register')}>Register</Button>
            </Group>
          )}
        </ScrollArea>
      </Drawer>
    </>
  );
}

export default Header;
