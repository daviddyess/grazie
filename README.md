# Welcome to the Grazie! Project

Grazie! is a themeable, standalone, and general purpose publishing platform built with React Router 7, Prisma, Mantine, and an SQLite database. Grazie's theme and routing system allow overriding features by placing them in the `/site` folder ([see site docs](https://github.com/daviddyess/grazie/blob/main/site/README.md)). Use Grazie! as it comes or extend it with your own themes and features.

- [React Router 7 Docs](https://reactrouter.com/home)
- [Prisma Docs](https://www.prisma.io/docs)
- [Mantine Docs](https://mantine.dev/getting-started/)

## Table of Contents

- [Database](##database)
- [Environment Variables](##environment-variables)
- [Install](##install)
- [Upgrades](##upgrades)
- [Configuration](##configuration)
- [Development](##development)
- [Styling](##styling)

## Database

Grazie! supports SQLite. To setup the database:

1. Set .env `DATABASE_URL` variable:
   - `DATABASE_URL="file:../data/data.db"`

Use of the `/data` folder for SQLite databases is optional, but recommended. If the `/data` folder is used for other purposes, internally, the name will be configurable, so you can obfuscate the folder name if you wish.

## Environment Variables

- DATABASE_URL - The database connection string or path to the SQLite database file, relative to the `/prisma` folder. Default is in the `/data` folder.
- AWS_ACCESS_KEY_ID - AWS access key ID
- AWS_SECRET_ACCESS_KEY - AWS secret access key
- AWS_DEFAULT_REGION - AWS default region
- AWS_S3_BUCKET - AWS S3 bucket name
- S3_PROVIDER - "linode" or "aws"
- MAIL_NO_REPLY - Email address to use for the "no reply" email address
- MAIL_SUPPORT - Email address to use for support emails
- SMTP_HOST - SMTP host
- SMTP_PORT - SMTP port
- SMTP_USER - SMTP user
- SMTP_PASSWORD - SMTP password
- SMTP_SECURE - SMTP secure ("true"/"false")
- SESSION_NAME - Session name for the cookie
- SESSION_DOMAIN - Session domain for the cookie
- SESSION_SECURE - Session secure for the cookie ("true"/"false")
- SESSION_SECRET - Session secret for the cookie
- SESSION_TTL - Session TTL in seconds
- ADMINS - Comma separated list of email addresses to auto assign as admins

## Installation

### Clone the repository:

```sh
git clone https://github.com/daviddyess/grazie.git
```

### Copy the `.env.default` to `.env`

```sh
cp .env.default .env
```

### Update the values in `.env` as needed.

- `DATABASE_URL` will put your database in the `/data` folder by default.
- `AWS_` and `S3_` variables are required for image uploads - tested on Linode, but should work with AWS
- `MAIL_` and `SMTP_` variables are required for performing user password resets.
- Update `SESSION_` variables as appropriate, most importantly the `SESSION_SECRET`
- `ADMINS` can be a comma separated list of email addresses to automatically assign the admin role upon account registration

### Install with NPM

```sh
npm install
```

### Deploy the database

```sh
npx prisma migrate deploy
```

### Generate Prisma Client

```sh
npx prisma generate
```

### Build

```sh
npm run build
```

### Start the server

```sh
npm start
```

Open your browser to `http://localhost:3000`

## Upgrades

Backup a copy of your database. Follow the installation instructions above, starting with `npm install`.

## Configuration

There are 3 parts of the configuration:

1. `.env` - Environment variables
2. `grazie.config.js` - Application configuration
3. Settings in the application, found in the Admin Dashboard

See the [Environment Variables](#environment-variables) section for more information on the `.env` file.

### `grazie.config.ts`

The `grazie.config.ts` file is used to configure the application. Copy the `grazie.config.default.ts` file and name it `grazie.config.ts`.

```sh
cp grazie.config.default.ts grazie.config.ts
```

The default configuration is:

```ts
import { Theme } from 'app/theme';
export { Theme } from 'app/theme';

// Default page name - string
export const pageName = 'Page';
// Theme Object
export const theme = Theme.theme;
// Site Settings
export const site = {
  name: 'Grazie!',
  slogan: 'Powered by Grazie!',
  description: 'My Grazie! Site',
  copyright: 2024,
  owner: 'David Dyess II',
  separator: ' | ',
  url: 'http://localhost:3000'
};

// Site Links
export const siteLinks = [];
// SEO Settings
export const metaSettings = {
  home: {
    title: 'Home'
  }
};
// Page components
export const Pages = {
  root: 'Page',
  dashboard: 'Dashboard'
};
```

#### Favicon

To override the default favicon, import an image file from the `/site` folder and use it as the `href` attribute in the exported `siteLinks` array.

```ts
import favicon from '/site/favicon.png';
// rest of grazie.config.ts
// Site Links
export const siteLinks = [
  {
    rel: 'icon',
    type: 'image/png',
    href: favicon
    }
];
```

### Admin Dashboard

The Settings section in the Admin dashboard can be used to configure the site settings and override the `grazie.config.ts` settings. The settings are stored in the database and cached at runtime or as they are updated.

### Fallbacks

If a setting is not found in the database, the `grazie.config.ts` settings are used as a fallback. If a setting is not found in the `grazie.config.ts` settings, a default value is used. If only the `grazie.config.default.ts` file is present, that file will be used instead of the preferred config file. To avoid conflicts in the future, it is recommended to never edit the default config file.

## Site Specific Features

## Development

From your terminal:

```sh
npm run dev
```

If you prefer not to use vite dev, you can run a development variation of the production server with a watcher:

```sh
npm run d
```

This starts your app in development mode, rebuilding assets on file changes.

### Generate a Database Migration

Replace "setup" below with a name for the migration:

```sh
npx prisma migrate dev --name setup
```

### Generate an Empty Migration

```sh
npx prisma migrate dev --create-only
```

### Migrate Database

```sh
npx prisma migrate dev
```

### Deploy Database

```sh
npx prisma migrate deploy
```

### Generate Prisma Client

```sh
npx prisma generate
```

### DIY

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

Grazie! comes with [Mantine](https://mantine.dev/).
