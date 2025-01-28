const SNAPSHOT_URL =
  'https://openqa.opensuse.org/snapshot-changes/opensuse/Tumbleweed/';

export async function fetchSnapshotPage() {
  try {
    const response = await fetch(SNAPSHOT_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching snapshot page:', error);
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
      link: new URL(`diff/${snapshotId}`, SNAPSHOT_URL).href
    };

    if (index === currentIndex) {
      // This is the current snapshot
      snapshots.current = snapshot;
    } else if (index < currentIndex) {
      // Lines before the current are pending
      snapshots.pending.push(snapshot);
    } else {
      // Lines after the current are published
      snapshots.published.push(snapshot);
    }
  });

  // Reverse pending array so newest pending is first
  snapshots.pending.reverse();

  return snapshots;
}

export async function getSnapshotData() {
  try {
    const content = await fetchSnapshotPage();
    return parseSnapshots(content);
  } catch (error) {
    console.error('Error processing snapshots:', error);
    throw error;
  }
}
