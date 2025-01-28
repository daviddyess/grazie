import { json } from '@remix-run/node';
import { getSnapshotData } from '~/lib/tumbleweed.server';

export async function loader() {
  try {
    const snapshots = await getSnapshotData();
    console.log('Current snapshot:', snapshots.current);
    console.log('Pending snapshots:', snapshots.pending.length, 'snapshots');
    console.log(
      'Published snapshots:',
      snapshots.published.length,
      'snapshots'
    );

    // Example: Print the 5 most recent published snapshots
    console.log('\nMost recent published snapshots:');
    snapshots.published.slice(0, 5).forEach((snapshot) => {
      console.log(`- ${snapshot.version}: ${snapshot.link}`);
    });
    return json(snapshots);
  } catch (error) {
    console.error('Failed to get snapshot data:', error);
  }
}
