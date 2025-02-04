import {
  type RouteConfig,
  index,
  prefix,
  route
} from '@react-router/dev/routes';

export default [
  index('routes/_index.tsx'),
  route('categories', 'routes/categories.tsx'),
  // /category
  ...prefix('category', [
    route('create', 'routes/category_.create.tsx'),
    route('update', 'routes/category_.update.tsx')
    // TODO: route(':slug', 'routes/category_.$slug.tsx')
  ]),
  route('comments/post/:postId', 'routes/comments_.post_.$postId.tsx'),
  // /dashboard
  ...prefix('dashboard', [
    index('routes/dashboard.tsx'),
    route('account', 'routes/dashboard.account.tsx'),
    // /dashboard/admin
    ...prefix('admin', [
      index('routes/dashboard.admin._index.tsx'),
      route('categories', 'routes/dashboard.admin.categories.tsx'),
      // TODO: route('comments', 'routes/dashboard.admin.comments.tsx'),
      route('pages', 'routes/dashboard.admin.pages.tsx'),
      route('posts', 'routes/dashboard.admin.posts.tsx'),
      route('privileges', 'routes/dashboard.admin.privileges.tsx'),
      route(
        'role/:roleId/privileges',
        'routes/dashboard.admin.role.$roleId.privileges.tsx'
      ),
      route(
        'role/:roleId/users',
        'routes/dashboard.admin.role.$roleId.users.tsx'
      ),
      route('roles', 'routes/dashboard.admin.roles.tsx'),
      route('settings', 'routes/dashboard.admin.settings.tsx'),
      route('users', 'routes/dashboard.admin.users.tsx')
    ]),
    route('pages', 'routes/dashboard.pages.tsx'),
    route('posts', 'routes/dashboard.posts.tsx')
  ]),
  route('feed.atom', 'routes/feed.atom.tsx'),
  route('feed.json', 'routes/feed.json.tsx'),
  route('feed.opml', 'routes/feed.opml.tsx'),
  route('feed.rss', 'routes/feed.rss.tsx'),
  route('login', 'routes/login.tsx'),
  route('logout', 'routes/logout.tsx'),
  // /note
  ...prefix('note', [
    route(':id', 'routes/note_.$id.tsx'),
    route('create', 'routes/note_.create.tsx'),
    route('update', 'routes/note_.update.tsx')
  ]),
  route('notes', 'routes/notes.tsx'),
  // /page
  ...prefix('page', [
    route(':slug', 'routes/page_.$slug.tsx'),
    route('create', 'routes/page_.create.tsx'),
    route('update', 'routes/page_.update.tsx')
  ]),
  route('pages', 'routes/pages.tsx'),
  // /post
  ...prefix('post', [
    route(':slug/comment', 'routes/post_.$slug_.comment.tsx'),
    route(':slug/edit', 'routes/post_.$slug_.edit.tsx'),
    route(':slug', 'routes/post_.$slug.tsx'),
    route('bookmark', 'routes/post_.bookmark.tsx'),
    route('create', 'routes/post_.create.tsx'),
    route('favorite', 'routes/post_.favorite.tsx'),
    route('update', 'routes/post_.update.tsx')
  ]),
  route('posts/:category', 'routes/posts_.$category.tsx'),
  route('posts', 'routes/posts.tsx'),
  // /privilege
  ...prefix('privilege', [
    route('create', 'routes/privilege_.create.tsx'),
    route('update', 'routes/privilege_.update.tsx')
  ]),
  route('register', 'routes/register.tsx'),
  route('robots.txt', 'routes/robots.txt.tsx'),
  // /role
  ...prefix('role', [
    route(
      ':roleId/privilege/create',
      'routes/role_.$roleId.privilege_.create.tsx'
    ),
    route(
      ':roleId/privilege/delete',
      'routes/role_.$roleId.privilege_.delete.tsx'
    ),
    route(
      ':roleId/privilege/update',
      'routes/role_.$roleId.privilege_.update.tsx'
    ),
    route(':roleId/user/create', 'routes/role_.$roleId.user_.create.tsx'),
    route(':roleId/user/delete', 'routes/role_.$roleId.user_.delete.tsx'),
    route(':roleId/user/update', 'routes/role_.$roleId.user_.update.tsx'),
    route('create', 'routes/role_.create.tsx'),
    route('update', 'routes/role_.update.tsx')
  ]),
  // /setting
  ...prefix('setting', [
    route('create', 'routes/setting_.create.tsx'),
    route('update', 'routes/setting_.update.tsx')
  ]),
  // /tumbleweed
  ...prefix('tumbleweed', [
    index('routes/tumbleweed.tsx'),
    route('diff/:snapshot', 'routes/tumbleweed_.diff.$snapshot.tsx'),
    route('feed.atom', 'routes/tumbleweed_.feed.atom.tsx'),
    route('feed.json', 'routes/tumbleweed_.feed.json.tsx'),
    route('feed.rss', 'routes/tumbleweed_.feed.rss.tsx')
  ]),
  // /user
  ...prefix('user', [
    //route('activate', 'routes/user_.activate.tsx'),
    route('reset', 'routes/user_.reset.tsx')
  ])
] satisfies RouteConfig;
