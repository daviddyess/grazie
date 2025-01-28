const SNAPSHOTS_URL =
  'https://openqa.opensuse.org/snapshot-changes/opensuse/Tumbleweed/';
const SNAPSHOT_URL =
  'https://openqa.opensuse.org/snapshot-changes/opensuse/Tumbleweed/diff/';

export async function fetchSnapshotPage() {
  try {
    const response = await fetch(SNAPSHOTS_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching snapshot page:', error);
    throw error;
  }
}

export async function parsePackageChanges(snapshot) {
  try {
    const response = await fetch(`${SNAPSHOT_URL}${snapshot}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const content = await response.text();
    console.log(content);
    const changes = {
      packages: []
    };

    // Split content into sections
    const [packageList, ...details] = content.split('=== Details ===');

    // Parse the package list section
    const packageLines = packageList
      .split('\n')
      .filter((line) => line.trim())
      .slice(1); // Skip "Packages changed:" header

    for (const line of packageLines) {
      // Removed leading whitespace requirement from regex
      const parts = line.trim().match(/^(\S+)(?:\s+\((.*?)\))?$/);
      if (parts) {
        const [, name, version] = parts;
        let version_change = null;
        if (version) {
          // Split and reverse the version change to show chronological order
          const [from, to] = version.split(' -> ').reverse();
          version_change = `${from} -> ${to}`;
        }
        const change = {
          name: name,
          version_change: version_change
        };
        changes.packages.push(change);
      }
    }

    return changes;
  } catch (error) {
    console.error('Error parsing package changes:', error);
    throw error;
  }
}

export function parseSnapshots(content) {
  const lines = content.split('<br/>').filter((line) => line.trim());
  const snapshots = {
    pending: [],
    current: null,
    published: []
  };

  // Find index of current snapshot (marked with <--)
  const currentIndex = lines.findIndex((line) => line.includes('&lt;--'));

  if (currentIndex === -1) {
    throw new Error('Could not find current snapshot marker');
  }

  // Process each line
  lines.forEach((line, index) => {
    // Extract snapshot ID using regex that matches the full link pattern
    const match = line.match(/<a href="diff\/(\d+)">(\d+)<\/a>/);
    if (!match) return;

    const snapshotId = match[1];
    const snapshot = {
      version: snapshotId,
      link: `${SNAPSHOT_URL}${snapshotId}`,
      change: null // Will be filled in below
    };

    if (index === currentIndex) {
      snapshots.current = snapshot;
    } else if (index < currentIndex) {
      snapshots.pending.push(snapshot);
    } else {
      snapshots.published.push(snapshot);
    }
  });

  // Add change property to each snapshot
  // For each snapshot, change points to the one before it chronologically
  if (snapshots.current) {
    if (snapshots.published.length > 0) {
      snapshots.current.change = snapshots.published[0].version;
    }

    for (let i = 0; i < snapshots.published.length - 1; i++) {
      snapshots.published[i].change = snapshots.published[i + 1].version;
    }

    // Last published snapshot has no previous version to compare against
    if (snapshots.published.length > 0) {
      snapshots.published[snapshots.published.length - 1].change = null;
    }

    // Handle pending snapshots (they point forward in time)
    for (let i = snapshots.pending.length - 1; i >= 0; i--) {
      if (i === snapshots.pending.length - 1) {
        snapshots.pending[i].change = snapshots.current.version;
      } else {
        snapshots.pending[i].change = snapshots.pending[i + 1].version;
      }
    }
  }

  return snapshots;
}

export async function getSnapshotData() {
  try {
    const content = await fetchSnapshotPage();
    const snapshots = parseSnapshots(content);

    // If you want to include package changes for the current snapshot
    if (snapshots.current) {
      const changes = await parsePackageChanges(snapshots.current.change);
      snapshots.current.packages = changes.packages;
    }

    return snapshots;
  } catch (error) {
    console.error('Error processing snapshots:', error);
    throw error;
  }
}

// Example usage
async function main() {
  try {
    const snapshots = await getSnapshotData();

    console.log('Current snapshot:', {
      version: snapshots.current.version,
      change: snapshots.current.change
    });

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
  } catch (error) {
    console.error('Failed to get snapshot data:', error);
  }
}
