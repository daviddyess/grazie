import { json } from '@remix-run/node';
import { getSnapshotData, parsePackageChanges } from '~/lib/tumbleweed.server';

export async function loader() {
  try {
    const snapshots = await getSnapshotData();

    console.log('Current snapshot:', {
      version: snapshots.current.version,
      change: snapshots.current.change
    });

    if (snapshots.pending.length > 0) {
      console.log('\nPending snapshots:');
      snapshots.pending.forEach((snapshot) => {
        console.log(`- ${snapshot.version} (changes from ${snapshot.change})`);
      });
    }

    console.log('\nRecent published snapshots:');
    snapshots.published.slice(0, 5).forEach((snapshot) => {
      console.log(
        `- ${snapshot.version} (changes from ${snapshot.change || 'none'})`
      );
    });

    // Example of parsing package changes from a diff

    if (snapshots.current.packages) {
      console.log('\nPackage changes in current snapshot:');
      snapshots.current.packages.forEach((pkg) => {
        if (pkg.version_change) {
          console.log(`- ${pkg.name}: ${pkg.version_change}`);
        } else {
          console.log(`- ${pkg.name}: modified`);
        }
      });
    }
    return json({ snapshots });
  } catch (error) {
    console.error('Failed to get snapshot data:', error);
  }
}
