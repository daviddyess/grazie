import { json, LoaderFunctionArgs } from '@remix-run/node';
import { getSnapshotDiff } from '~/lib/tumbleweed';
import { createAbility } from '~/utils/session.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  const snapshot = Number(params.snapshot);

  const changes = await getSnapshotDiff(snapshot);

  return json({ changes });
}
