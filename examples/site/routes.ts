import {
  index,
  prefix,
  route,
  type RouteConfig
} from '@react-router/dev/routes';

export const siteRoutes = [
  route('test', '../site/routes/test.tsx')
] satisfies RouteConfig;
