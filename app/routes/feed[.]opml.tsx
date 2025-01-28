import { Opml } from '@gaphub/feed';
import { LoaderFunctionArgs } from '@remix-run/node';
import { site } from '@/grazie';
import { createAbility } from '~/utils/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  const opml = new Opml();
  opml.setHead('title', site.name);
  opml.setHead('description', site.description);
  opml.setHead('url', site.url);
  opml.addOutline({
    text: site.name,
    outlines: [
      {
        text: `Latest Posts - RSS | ${site.name}`,
        type: 'rss',
        xmlUrl: `${site.url}/feed.rss`
      },
      {
        text: `Latest Posts - Atom | ${site.name}`,
        type: 'atom',
        xmlUrl: `${site.url}/feed.atom`
      },
      {
        text: `Latest Posts - JSON | ${site.name}`,
        type: 'json',
        xmlUrl: `${site.url}/feed.json`
      }
    ]
  });

  return new Response(opml.toString(), {
    status: 200,
    headers: { 'Content-Type': 'text/x-opml' }
  });
}
