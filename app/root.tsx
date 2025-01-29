/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';
import {
  Button,
  ColorSchemeScript,
  Container,
  Group,
  MantineProvider,
  Title,
  Text
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { cssBundleHref } from '@remix-run/css-bundle';
import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs
} from '@remix-run/node';
import {
  isRouteErrorResponse,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
  useRouteLoaderData
} from '@remix-run/react';
import { getToast } from 'remix-toast';
import { AbilityProvider } from '~/components/AbilityProvider';
import { ThemeProvider } from '~/components/ThemeProvider';
import { setting } from '~/lib/setting.server';
import classes from '~/styles/NotFound.module.css';
import { getUser } from '~/utils/session.server';
import { site, theme } from '@/grazie';

const cssBundleLink = cssBundleHref
  ? [{ rel: 'stylesheet', href: cssBundleHref }]
  : [];

export const links: LinksFunction = () => [
  ...cssBundleLink,
  {
    rel: 'alternate',
    href: '/feed.rss',
    title: 'RSS Feed',
    type: 'application/rss+xml'
  },
  {
    rel: 'alternate',
    href: '/feed.atom',
    title: 'Atom Feed',
    type: 'application/atom+xml'
  },
  {
    rel: 'alternate',
    href: '/feed.json',
    title: 'JSON Feed',
    type: 'application/feed+json'
  },
  {
    rel: 'alternate',
    href: '/feeds.opml',
    title: 'OPML Feed',
    type: 'text/opml+xml'
  }
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  const { toast, headers } = await getToast(request);

  return json(
    {
      user,
      theme: {
        footer: {
          links: await setting({ name: 'footer.links', defaultValue: [] }),
          social: await setting({ name: 'footer.social', defaultValue: {} })
        },
        navbar: {
          links: await setting({ name: 'navbar.links', defaultValue: [] })
        }
      },
      site: await setting({ name: 'site', group: true, defaultValue: site }),
      toast
    },
    { headers }
  );
};

export default function App() {
  const data = useLoaderData();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta property="og:site_name" content={data?.site?.name} />

        <Meta />
        <Links />
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <AbilityProvider>
          <MantineProvider defaultColorScheme="auto" theme={theme}>
            <ThemeProvider>
              <Outlet />
              <ScrollRestoration />
              <Scripts />
              <LiveReload />
            </ThemeProvider>
            <Notifications />
          </MantineProvider>
        </AbilityProvider>
      </body>
    </html>
  );
}

const ErrorPage: React.FC<{
  children: React.ReactNode;
  status?: number | string;
}> = ({ children, status }) => {
  const data = useRouteLoaderData('root');
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta property="og:site_name" content={data?.site?.name} />
        <title>
          {data.site.name}
          {site?.separator ?? ' | '}
          {status}
        </title>
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <AbilityProvider>
          <MantineProvider defaultColorScheme="dark" theme={theme}>
            <ThemeProvider>
              {children}
              <ScrollRestoration />
              <Scripts />
              <LiveReload />
            </ThemeProvider>
            <Notifications />
          </MantineProvider>
        </AbilityProvider>
      </body>
    </html>
  );
};

export function ErrorBoundary() {
  const error = useRouteError();
  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        return (
          <ErrorPage status="Page Not Found">
            <Container className={classes.root}>
              <div className={classes.label}>404</div>
              <Title className={classes.title}>
                Unable to find the page you requested.
              </Title>
              <Text
                c="dimmed"
                size="lg"
                ta="center"
                className={classes.description}
              >
                Please check the URL, and failing that, report the issue to us.
              </Text>
              <Group justify="center">
                <Button variant="subtle" size="md" component={Link} to="/">
                  Take me back to home page
                </Button>
              </Group>
            </Container>
          </ErrorPage>
        );
      default:
        return (
          <ErrorPage status="Error">
            <Container className={classes.root}>
              <div className={classes.label}>{error.status}</div>
              <Text
                c="dimmed"
                size="lg"
                ta="center"
                className={classes.description}
              >
                {error.data.message}
              </Text>
            </Container>
          </ErrorPage>
        );
    }
  }
  // Don't forget to typecheck with your own logic.
  // Any value can be thrown, not just errors!
  let errorMessage = 'Unknown error';
  if (error?.message) {
    errorMessage = error.message;
  }

  return (
    <ErrorPage>
      <Container className={classes.root}>
        <div className={classes.label}>Error</div>
        <Title className={classes.title}>Something went wrong.</Title>
        <Text c="dimmed" size="lg" ta="center" className={classes.description}>
          {errorMessage}
        </Text>
        <Group justify="center">
          <Button variant="subtle" size="md">
            Take me back to home page
          </Button>
        </Group>
      </Container>
    </ErrorPage>
  );
}
