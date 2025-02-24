import {
  type RouteConfig,
  index,
  prefix,
  route
} from '@react-router/dev/routes';
import { accessSync, constants } from 'fs';
import { join } from 'path';

async function importSiteRoutes() {
  try {
    accessSync(join(__dirname, `../site/routes.ts`), constants.F_OK);
    return (await import('../site/routes')).siteRoutes;
  } catch (error) {
    console.log('Site Routes: ', 'Not Configured');
    return [];
  }
}

const siteRoutes = await importSiteRoutes();

function gRoute(path: string) {
  try {
    accessSync(join(__dirname, `../site/${path}`), constants.F_OK);
    console.log('Site Override Route: ', `${path} -> ../site/${path}`);
    return `../site/${path}`;
  } catch (error) {
    return path;
  }
}

export default [
  index(gRoute('routes/_index.tsx')),
  ...prefix('block', [
    route('create', gRoute('routes/block_.create.tsx')),
    route('update', gRoute('routes/block_.update.tsx')),
    ...prefix('group', [
      route('create', gRoute('routes/block_.group_.create.tsx')),
      route('update', gRoute('routes/block_.group_.update.tsx'))
    ])
  ]),
  route('categories', gRoute('routes/categories.tsx')),
  // /category
  ...prefix('category', [
    route('create', gRoute('routes/category_.create.tsx')),
    route('update', gRoute('routes/category_.update.tsx'))
    // TODO: route(':slug', 'routes/category_.$slug.tsx')
  ]),
  route('comments/post/:postId', gRoute('routes/comments_.post_.$postId.tsx')),
  // /dashboard
  route('dashboard', 'routes/dashboard.tsx', [
    //index(gRoute('routes/dashboard.account.tsx')),
    route('account', gRoute('routes/dashboard.account.tsx')),
    // /dashboard/admin
    ...prefix('admin', [
      index(gRoute('routes/dashboard.admin._index.tsx')),
      route('blocks', gRoute('routes/dashboard.admin.blocks.tsx')),
      route('block-groups', gRoute('routes/dashboard.admin.block-groups.tsx')),
      route('categories', gRoute('routes/dashboard.admin.categories.tsx')),
      // TODO: route('comments', 'routes/dashboard.admin.comments.tsx'),
      route('pages', gRoute('routes/dashboard.admin.pages.tsx')),
      route('posts', gRoute('routes/dashboard.admin.posts.tsx')),
      route('privileges', gRoute('routes/dashboard.admin.privileges.tsx')),
      route(
        'role/:roleId/privileges',
        gRoute('routes/dashboard.admin.role.$roleId.privileges.tsx')
      ),
      route(
        'role/:roleId/users',
        gRoute('routes/dashboard.admin.role.$roleId.users.tsx')
      ),
      route('roles', gRoute('routes/dashboard.admin.roles.tsx')),
      route('settings', gRoute('routes/dashboard.admin.settings.tsx')),
      route('users', gRoute('routes/dashboard.admin.users.tsx'))
    ]),
    route('pages', gRoute('routes/dashboard.pages.tsx')),
    route('posts', gRoute('routes/dashboard.posts.tsx'))
  ]),
  route('feed.atom', gRoute('routes/feed.atom.tsx')),
  route('feed.json', gRoute('routes/feed.json.tsx')),
  route('feed.opml', gRoute('routes/feed.opml.tsx')),
  route('feed.rss', gRoute('routes/feed.rss.tsx')),
  route('login', gRoute('routes/login.tsx')),
  route('logout', gRoute('routes/logout.tsx')),
  // /note
  ...prefix('note', [
    route(':id', gRoute('routes/note_.$id.tsx')),
    route('create', gRoute('routes/note_.create.tsx')),
    route('update', gRoute('routes/note_.update.tsx'))
  ]),
  route('notes', gRoute('routes/notes.tsx')),
  // /page
  ...prefix('page', [
    route(':slug', gRoute('routes/page_.$slug.tsx')),
    route('create', gRoute('routes/page_.create.tsx')),
    route('delete', gRoute('routes/page_.delete.tsx')),
    route('update', gRoute('routes/page_.update.tsx'))
  ]),
  route('pages', gRoute('routes/pages.tsx')),
  // /post
  ...prefix('post', [
    route(':slug/comment', gRoute('routes/post_.$slug_.comment.tsx')),
    route(':slug/edit', gRoute('routes/post_.$slug_.edit.tsx')),
    route(':slug', gRoute('routes/post_.$slug.tsx')),
    route('bookmark', gRoute('routes/post_.bookmark.tsx')),
    route('create', gRoute('routes/post_.create.tsx')),
    route('delete', gRoute('routes/post_.delete.tsx')),
    route('favorite', gRoute('routes/post_.favorite.tsx')),
    route('update', gRoute('routes/post_.update.tsx'))
  ]),
  route('posts/:category', gRoute('routes/posts_.$category.tsx')),
  route('posts/bookmarks', gRoute('routes/posts_.bookmarks.tsx')),
  route('posts/favorites', gRoute('routes/posts_.favorites.tsx')),
  route('posts', gRoute('routes/posts.tsx')),
  // /privilege
  ...prefix('privilege', [
    route('create', gRoute('routes/privilege_.create.tsx')),
    route('update', gRoute('routes/privilege_.update.tsx'))
  ]),
  route('register', gRoute('routes/register.tsx')),
  route('robots.txt', gRoute('routes/robots.txt.tsx')),
  // /role
  ...prefix('role', [
    route(
      ':roleId/privilege/create',
      gRoute('routes/role_.$roleId.privilege_.create.tsx')
    ),
    route(
      ':roleId/privilege/delete',
      gRoute('routes/role_.$roleId.privilege_.delete.tsx')
    ),
    route(
      ':roleId/privilege/update',
      gRoute('routes/role_.$roleId.privilege_.update.tsx')
    ),
    route(
      ':roleId/user/create',
      gRoute('routes/role_.$roleId.user_.create.tsx')
    ),
    route(
      ':roleId/user/delete',
      gRoute('routes/role_.$roleId.user_.delete.tsx')
    ),
    route(
      ':roleId/user/update',
      gRoute('routes/role_.$roleId.user_.update.tsx')
    ),
    route('create', gRoute('routes/role_.create.tsx')),
    route('update', gRoute('routes/role_.update.tsx'))
  ]),
  // /setting
  ...prefix('setting', [
    route('create', gRoute('routes/setting_.create.tsx')),
    route('update', gRoute('routes/setting_.update.tsx'))
  ]),
  // /tumbleweed
  ...prefix('tumbleweed', [
    index(gRoute('routes/tumbleweed.tsx')),
    route('diff/:snapshot', gRoute('routes/tumbleweed_.diff.$snapshot.tsx')),
    route('feed.atom', gRoute('routes/tumbleweed_.feed.atom.tsx')),
    route('feed.json', gRoute('routes/tumbleweed_.feed.json.tsx')),
    route('feed.rss', gRoute('routes/tumbleweed_.feed.rss.tsx'))
  ]),
  // /user
  ...prefix('user', [
    //route('activate', 'routes/user_.activate.tsx'),
    route('reset', gRoute('routes/user_.reset.tsx'))
  ]),
  ...siteRoutes
] satisfies RouteConfig;
