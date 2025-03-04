/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { useEffect, useState } from 'react';
import { SegmentedControl, Text } from '@mantine/core';
import {
  IconArticle,
  IconSettings,
  IconUsers,
  IconLogout,
  IconCategory2,
  IconNews,
  IconDashboard,
  IconStar,
  IconShield,
  IconUserCog,
  IconBlocks,
  IconBoxMultiple
} from '@tabler/icons-react';
import classes from '~/components/Dashboard/Navbar.module.css';
import { Link, useMatches, useNavigate } from 'react-router';
import useUser from '~/hooks/useUser';
import { Can } from '~/components/Can';
import { link } from 'joi';

const tabs = {
  account: [
    {
      link: '/dashboard/account',
      label: 'Account Settings',
      icon: IconUserCog
    },
    { link: '/dashboard/posts', label: 'Posts', icon: IconNews },
    { link: '/dashboard/pages', label: 'Pages', icon: IconArticle }
  ],
  system: [
    {
      link: '/dashboard/admin',
      label: 'Overview',
      icon: IconDashboard,
      links: []
    },
    {
      link: '/dashboard/admin/blocks',
      label: 'Blocks',
      icon: IconBlocks,
      links: []
    },
    {
      link: '/dashboard/admin/block-groups',
      label: 'Block Groups',
      icon: IconBoxMultiple,
      links: []
    },
    {
      link: '/dashboard/admin/categories',
      label: 'Categories',
      icon: IconCategory2,
      links: []
    },
    {
      link: '/dashboard/admin/posts',
      label: 'Posts',
      icon: IconNews,
      links: []
    },
    {
      link: '/dashboard/admin/pages',
      label: 'Pages',
      icon: IconArticle,
      links: []
    },
    {
      link: '/dashboard/admin/roles',
      label: 'Roles',
      icon: IconShield,
      links: []
    },
    {
      link: '/dashboard/admin/privileges',
      label: 'Privileges',
      icon: IconStar,
      links: []
    },
    {
      link: '/dashboard/admin/users',
      label: 'Users',
      icon: IconUsers,
      links: []
    },
    {
      link: '/dashboard/admin/settings',
      label: 'Settings',
      icon: IconSettings,
      links: []
    }
  ]
};

export default function Navbar() {
  const matches = useMatches();
  const { id } = matches[matches.length - 1];
  const [section, setSection] = useState<'account' | 'system'>(
    id.includes('dashboard.admin') ? 'system' : 'account'
  );
  const [active, setActive] = useState('Billing');

  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (id.includes('dashboard.admin')) {
      setSection('system');
    }
    if (!id.includes('dashboard.admin')) {
      setSection('account');
    }
  }, [id]);

  const links = tabs[section].map((item) => (
    <Link
      className={classes.link}
      data-active={item.label === active || undefined}
      to={item.link}
      key={item.label}
      onClick={() => setActive(item.label)}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div>
        <Text
          fw={500}
          size="sm"
          className={classes.title}
          c="dimmed"
          mb="xs"
          ta="center"
        >
          {user?.email}
        </Text>
        <Can I="manage" a="Dashboard">
          <SegmentedControl
            value={section}
            onChange={(value: any) => {
              setSection(value);
              if (value === 'system') {
                navigate('/dashboard/admin');
              }
              if (value === 'account') {
                navigate('/dashboard');
              }
            }}
            transitionTimingFunction="ease"
            fullWidth
            data={[
              { label: 'Account', value: 'account' },
              { label: 'System', value: 'system' }
            ]}
          />
        </Can>
      </div>

      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        {/*<Link
          to="#"
          className={classes.link}
        >
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </Link>*/}

        <Link to="/logout" className={classes.link}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </Link>
      </div>
    </nav>
  );
}
