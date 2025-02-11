import { Feed } from '@gaphub/feed';
import { getSnapshotData } from '~/lib/tumbleweed';
import { site } from '@/grazie';

export async function loader() {
  const snapshots = await getSnapshotData();
  const feed = new Feed({
    title: site?.name ?? '',
    description: site?.description,
    id: `${site.url}/feed.rss`,
    link: `${site.url}`,
    language: 'en',
    image: `${site.url}/logo.png`,
    favicon: `${site.url}/favicon.ico`,
    copyright: `Copyright ${site.copyright} ${site.owner}`,
    feedLinks: {
      json: `${site.url}/tumbleweed/feed.json`,
      atom: `${site.url}/tumbleweed/feed.atom`,
      rss: `${site.url}/tumbleweed/feed.rss`,
      opml: `${site.url}/feed.opml`
    }
  });
  // Add the current snapshot to the feed
  feed.addItem({
    title: `Snapshot ${snapshots?.current?.version} Published`,
    id: snapshots?.current?.version,
    link: `${site.url}/tumbleweed?diff=${snapshots?.current?.change}`,
    description: `openSUSE Tumbleweed ${snapshots?.current?.version} was published`,
    content: `openSUSE Tumbleweed ${snapshots?.current?.version} was published`,
    date: new Date(snapshots?.current?.date)
  });
  // Add all other published snapshots to the feed
  snapshots.published.forEach((snapshot) => {
    feed.addItem({
      title: `Snapshot ${snapshot?.version} Published`,
      id: snapshot?.version,
      link: `${site.url}/tumbleweed?diff=${snapshot.version}`,
      description: `openSUSE Tumbleweed ${snapshot.version} was published`,
      content: `openSUSE Tumbleweed ${snapshot.version} was published`,
      date: new Date(snapshot.date)
    });
  });

  return new Response(feed.rss2(), {
    status: 200,
    headers: { 'Content-Type': 'application/rss+xml' }
  });
}
