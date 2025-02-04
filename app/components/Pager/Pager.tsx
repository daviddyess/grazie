/**
 * Grazie
 * @copyright Copyright (c) 2024-2025 David Dyess II
 * @license MIT see LICENSE
 */
import { Group, Pagination } from '@mantine/core';
import { useLoaderData, useSearchParams } from 'react-router';

export default function Pager({ showEmpty = false }: { showEmpty?: boolean }) {
  const {
    pager: { count, page, total }
  } = useLoaderData();

  const prev = page - 1;
  const next = page + 1;
  const first = 1;
  const last = total;

  const [searchParams] = useSearchParams();

  const pagerPageURL = (page: string) => {
    searchParams.set('page', page);
    if (count) {
      searchParams.set('count', count);
    }
    return `?${searchParams.toString()}`;
  };

  return (
    <>
      {(total > 1 || showEmpty) && (
        <Pagination.Root
          total={total}
          value={page}
          getItemProps={(page) => ({
            component: 'a',
            href: pagerPageURL(page)
          })}
        >
          <Group gap={7} justify="center" my="sm">
            {page !== 1 && (
              <>
                {total > 2 && (
                  <Pagination.First component="a" href={pagerPageURL(first)} />
                )}

                <Pagination.Previous component="a" href={pagerPageURL(prev)} />
              </>
            )}
            <Pagination.Items />
            {page !== total && (
              <>
                <Pagination.Next component="a" href={pagerPageURL(next)} />
                {page !== total - 1 && (
                  <Pagination.Last component="a" href={pagerPageURL(last)} />
                )}
              </>
            )}
          </Group>
        </Pagination.Root>
      )}
    </>
  );
}
