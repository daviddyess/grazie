import { Feed } from '@gaphub/feed';
import { LoaderFunctionArgs } from '@remix-run/node';
import { getPosts } from '~/lib/post.server';
import { sentry } from '~/lib/sentry.server';
import { pagerParams } from '~/utils/searchParams.server';
import { site, metaSettings } from '@/grazie';
import { createAbility, getSession } from '~/utils/session.server';
import { Link } from '@mantine/tiptap';
import { Highlight } from '@tiptap/extension-highlight';
import { StarterKit } from '@tiptap/starter-kit';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { generateHTML } from '@tiptap/html';
import YouTube from '@tiptap/extension-youtube';

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }
  // 404 error if no read access
  await sentry(request, {
    action: 'read',
    subject: 'Post',
    item: { published: true }
  });

  const feed = new Feed({
    title: site?.name ?? '',
    description: site?.description,
    id: `${site.url}/feed.json`,
    link: `${site.url}`,
    language: 'en',
    image: `${site.url}/logo.png`,
    favicon: `${site.url}/favicon.ico`,
    copyright: `Copyright ${site.copyright} ${site.owner}`,
    feedLinks: {
      json: `${site.url}/feed.json`,
      atom: `${site.url}/feed.atom`,
      rss: `${site.url}/feed.rss`,
      opml: `${site.url}/feed.opml`
    }
  });

  const { count, page } = pagerParams(request, 25);

  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get('userId') as number;

  const query = {
    filter: { published: true },
    limit: count,
    offset: page ? (page - 1) * count : 0
  };
  const posts = await getPosts(query, userId);

  posts.nodes.forEach((post) => {
    feed.addItem({
      title: post?.title ?? 'Unititled',
      id: post?.title ?? 'Unititled',
      link: `${site.url}/post/${post.slug}`,
      description: `${post.search?.substring(0, 100)}...`,
      content: generateHTML(JSON.parse(post.body), [
        StarterKit,
        Highlight,
        Subscript,
        Superscript,
        TextAlign,
        Underline,
        YouTube,
        Link
      ]),
      date: new Date(post.updatedAt),
      author: {
        name: post.author.displayName,
        link: `${site.url}/author/${post.author.username}`
      }
    });
  });

  return new Response(feed.json1(), {
    status: 200,
    headers: { 'Content-Type': 'application/feed+json' }
  });
}
