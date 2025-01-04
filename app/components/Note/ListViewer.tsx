/**
 * Grazie
 * @package Note Library
 * @copyright Copyright (c) 2025 David Dyess II
 * @license MIT see LICENSE
 */
import { Box, List } from '@mantine/core';
import { IconCircleCheck, IconCircleDashed } from '@tabler/icons-react';
import { Fragment } from 'react/jsx-runtime';

export const SubItemList = ({ listType, data, path }) => {
  return (
    <List
      type={listType === 'ordered' ? 'ordered' : undefined}
      styles={{
        itemLabel: { width: '100%' },
        itemWrapper: { width: '100%' }
      }}
      withPadding
    >
      {data?.map((list: any, key: any) => (
        <Fragment key={`${path}-${key}`}>
          <List.Item
            icon={
              listType === 'checked-icon' &&
              (list?.checked ? <IconCircleCheck /> : <IconCircleDashed />)
            }
          >
            {list.label}
          </List.Item>

          {list?.list?.length > 0 && (
            <SubItemList
              listType={listType}
              data={list?.list}
              path={`${path}.${key}.list`}
            />
          )}
        </Fragment>
      ))}
    </List>
  );
};

export const ListViewer = ({ data }: { form: any }) => {
  const listType = data?.listType;
  return (
    <Box>
      <List
        type={listType === 'ordered' ? 'ordered' : undefined}
        styles={{
          itemLabel: { width: '100%' },
          itemWrapper: { width: '100%' }
        }}
      >
        {data?.list?.map((list: any, key: any) => (
          <Fragment key={`list-${key}`}>
            <List.Item
              icon={
                data.listType === 'checked-icon' &&
                (list?.checked ? <IconCircleCheck /> : <IconCircleDashed />)
              }
            >
              {list.label}
            </List.Item>

            {list?.list?.length > 0 && (
              <SubItemList
                listType={listType}
                data={list?.list}
                path={`body.list.${key}.list`}
              />
            )}
          </Fragment>
        ))}
      </List>
    </Box>
  );
};
