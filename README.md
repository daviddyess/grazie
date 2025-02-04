# Welcome to the Grazie! Project

Grazie! is a themeable, standalone, and general purpose publishing platform built with React Router 7, Prisma, Mantine, and an SQLite database.

- [Remix Docs](https://remix.run/docs)
- [Prisma Docs](https://www.prisma.io/docs)

## Database

Grazie! supports SQLite. To setup the database:

1. Set .env `DATABASE_URL` variable:
   - `DATABASE_URL="file:../data/data.db"`

Use of the `/data` folder for SQLite databases is optional, but recommended. If the `/data` folder is used for other purposes, internally, the name will be configurable, so you can obfuscate the folder name if you wish.

## Environment Variables

- DATABASE_URL - The database connection string or path to the SQLite database file, relative to the `/prisma` folder
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
- THEME - Theme name
- ADMINS - Comma separated list of email addresses to auto assign as admins

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

## Deployment

### Deploy Database

```sh
npx prisma migrate deploy
```

### Build

First, build your app for production:

```sh
npm run build
```

### Serve

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

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
