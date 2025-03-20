import { site, siteLinks, theme } from '@/grazie';
import {
  Button,
  ColorSchemeScript,
  Container,
  Group,
  mantineHtmlProps,
  MantineProvider,
  Text,
  Title
} from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';
import {
  data,
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from 'react-router';
import { getToast } from 'remix-toast';
import { AbilityProvider } from '~/components/AbilityProvider';
import { ThemeProvider } from '~/components/ThemeProvider';
import { setting } from '~/lib/setting.server';
import classes from '~/styles/NotFound.module.css';
import { getUser } from '~/utils/session.server';
import type { Route } from './+types/root';
import { getBlocksGroup } from './lib/blockGroup.server';

export function links() {
  return [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous'
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap'
    },
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
    },
    ...siteLinks
  ];
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const user = await getUser(request);
  const { toast, headers } = await getToast(request);
  const leftBlocks = await getBlocksGroup({ name: 'left' });
  return data(
    {
      blocksGroup: {
        left: leftBlocks
      },
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

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData();

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:site_name" content={data?.site?.name} />
        <ColorSchemeScript defaultColorScheme="auto" />
        <Meta />
        <Links />
      </head>
      <body>
        <AbilityProvider>
          <MantineProvider defaultColorScheme="auto" theme={theme}>
            <ThemeProvider>{children}</ThemeProvider>
            <Notifications />
          </MantineProvider>
          <ScrollRestoration />
          <Scripts />
        </AbilityProvider>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }
  /*
  return (
        <main className="pt-16 p-4 container mx-auto">
          <h1>{message}</h1>
          <p>{details}</p>
          {stack && (
            <pre className="w-full p-4 overflow-x-auto">
              <code>{stack}</code>
            </pre>
          )}
        </main>
  );
*/
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        return (
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
        );
      default:
        return (
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
  );
}
