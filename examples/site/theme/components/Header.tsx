import {
  Accordion,
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
  HoverCard,
  Menu,
  rem,
  ScrollArea,
  SimpleGrid,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, useNavigate } from 'react-router';
import {
  IconBook,
  IconChartPie3,
  IconChevronDown,
  IconCode,
  IconCoin,
  IconFingerprint,
  IconNotification,
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
  IconPhoto
} from '@tabler/icons-react';
import cx from 'clsx';
import { useState } from 'react';
import useUser from '~/hooks/useUser';
import classes from '!~/theme/styles/Header.module.css';
import { useTheme } from '~/hooks/useTheme';

const mockdata = [
  {
    icon: IconCode,
    title: 'Open source',
    description: 'This Pokémon’s cry is very loud and distracting'
  },
  {
    icon: IconCoin,
    title: 'Free for everyone',
    description: 'The fluid of Smeargle’s tail secretions changes'
  },
  {
    icon: IconBook,
    title: 'Documentation',
    description: 'Yanma is capable of seeing 360 degrees without'
  },
  {
    icon: IconFingerprint,
    title: 'Security',
    description: 'The shell’s rounded shape and the grooves on its.'
  },
  {
    icon: IconChartPie3,
    title: 'Analytics',
    description: 'This Pokémon uses its flying ability to quickly chase'
  },
  {
    icon: IconNotification,
    title: 'Notifications',
    description: 'Combusken battles with the intensely hot flames it spews'
  }
];

const userMenuData = [
  {
    icon: IconHeart,
    title: 'Liked posts'
  },
  {
    icon: IconStar,
    title: 'Saved posts'
  },
  {
    icon: IconMessage,
    title: 'My Comments'
  },
  {
    icon: IconFriends,
    title: 'My Connections'
  },
  {
    icon: IconSettings,
    title: 'Account Settings'
  },
  {
    icon: IconLogout,
    title: 'Logout',
    to: '/logout'
  }
];

export function Header() {
  const navigate = useNavigate();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const [userLinksOpened, { toggle: toggleUserLinks }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const user = useUser();
  const isLoggedIn = user?.isLoggedIn ?? false;
  const username = user?.username ?? 'Guest';
  const theme = useMantineTheme();
  const {
    data: { navbar, site }
  } = useTheme();

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

  return (
    <Box pb={10}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Anchor component={Link} to="/" underline="never">
            <Text
              gradient={{ from: 'indigo', to: 'blue', deg: 90 }}
              fw={500}
              size="xl"
              variant="gradient"
            >
              {site?.name ?? 'Site Name'}
            </Text>
          </Anchor>

          <Group h="100%" gap={0} visibleFrom="sm">
            <Link to="/" className={classes.link}>
              Home
            </Link>

            {navbar?.links?.map((navlink, index) => (
              <Link
                key={`navlink-${index}`}
                to={navlink.to}
                className={classes.link}
              >
                {navlink.label}
              </Link>
            ))}
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
                  <IconChevronDown size={12} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              {isLoggedIn ? (
                <>
                  <Menu.Item
                    leftSection={
                      <IconHeart
                        size={14}
                        color={theme.colors.red[6]}
                        stroke={1.5}
                      />
                    }
                  >
                    Liked posts
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconStar
                        size={14}
                        color={theme.colors.yellow[6]}
                        stroke={1.5}
                      />
                    }
                  >
                    Saved posts
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconMessage
                        size={14}
                        color={theme.colors.blue[6]}
                        stroke={1.5}
                      />
                    }
                  >
                    Your comments
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconFriends color="green" size={14} stroke={1.5} />
                    }
                    onClick={() => navigate('/connections')}
                  >
                    My Connections
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Label>Theme</Menu.Label>

                  <Menu.Divider />
                  <Menu.Label>Settings</Menu.Label>
                  <Menu.Item
                    leftSection={<IconDashboard size={14} stroke={1.5} />}
                    onClick={() => navigate('/dashboard')}
                  >
                    Dashboard
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconSettings size={14} stroke={1.5} />}
                    onClick={() => navigate('/dashboard/account')}
                  >
                    Account settings
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconSwitchHorizontal size={14} stroke={1.5} />
                    }
                  >
                    Change account
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconLogout size={14} stroke={1.5} />}
                    onClick={() => navigate('/logout')}
                  >
                    Logout
                  </Menu.Item>
                </>
              ) : (
                <>
                  <Menu.Item
                    leftSection={<IconLogin size={14} stroke={1.5} />}
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    leftSection={<IconUserPlus size={14} stroke={1.5} />}
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </Menu.Item>
                </>
              )}
            </Menu.Dropdown>
          </Menu>
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title={site?.name ?? 'Site Name'}
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          <a href="#" className={classes.link}>
            Home
          </a>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Features
              </Box>
              <IconChevronDown
                style={{ width: rem(16), height: rem(16) }}
                color={theme.colors.blue[6]}
              />
            </Center>
          </UnstyledButton>

          <a href="#" className={classes.link}>
            Learn
          </a>
          <a href="#" className={classes.link}>
            Academy
          </a>

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
                    style={{ width: rem(16), height: rem(16) }}
                    color={theme.colors.blue[6]}
                  />
                </Center>
              </UnstyledButton>
              <Collapse in={userLinksOpened}>{userLinks}</Collapse>
            </>
          ) : (
            <Group justify="center" grow pb="xl" px="md">
              <Button variant="default">Log in</Button>
              <Button>Sign up</Button>
            </Group>
          )}
        </ScrollArea>
      </Drawer>
    </Box>
  );
}

export default Header;
