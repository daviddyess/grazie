/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import {
  Alert,
  Button,
  Card,
  Grid,
  Group,
  Stack,
  Switch,
  Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import '@mantine/tiptap/styles.layer.css';
import { Form, useLoaderData, useNavigate, useSubmit } from 'react-router';
import type { JSONContent } from '@tiptap/core';
import type { Dispatch, SetStateAction } from 'react';
import { useMemo, useState } from 'react';
import MantineEditor from '~/components/Tiptap/Editor';
import { DebugCollapse } from '../DebugCollapse';
import { useAbility } from '~/hooks/useAbility';

interface Editor {
  id?: number | null;
  locked?: boolean;
  pinned?: boolean;
  parentId?: string | number;
  postId?: string | number;
  body?: { type?: string; content?: JSONContent[] | undefined };
  closeEditor?: Dispatch<SetStateAction<boolean>>;
}

const CommentEditor = ({
  id = null,
  locked = false,
  pinned = false,
  parentId,
  postId,
  body = { type: 'doc' },
  closeEditor
}: Editor) => {
  const form = useForm({
    initialValues: {
      id,
      locked,
      pinned,
      parentId,
      postId,
      body: typeof body === 'string' ? JSON.parse(body) : body
    }
  });

  const [errorMsg, setErrorMsg] = useState('');

  const route = 'comment';

  const submit = useSubmit();

  const ability = useAbility();

  const isAdmin = useMemo(() => ability.can('manage', 'Comment'), [ability]);

  const CloseBtn = () => {
    return closeEditor ? (
      <Button color="yellow" onClick={() => closeEditor(false)} variant="light">
        Cancel
      </Button>
    ) : null;
  };

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card withBorder>
          <Card.Section p={10}>
            {errorMsg ? (
              <Alert title="Error" color="red">
                {errorMsg}
              </Alert>
            ) : null}
            <Form
              method="post"
              action={route}
              onSubmit={form.onSubmit(async (_v, e) => {
                submit(e.currentTarget, {
                  replace: true,
                  unstable_flushSync: true
                });
                if (closeEditor) {
                  closeEditor(false);
                }
              })}
            >
              <Stack>
                {id && <input type="hidden" name="id" value={id} />}
                {postId && <input type="hidden" name="postId" value={postId} />}
                {parentId && (
                  <input type="hidden" name="parentId" value={parentId} />
                )}
                <Title order={3}>
                  {!parentId ? `New Comment` : `New Reply`}
                </Title>
                <div>Comment</div>
                <MantineEditor name="body" form={form} />
                <input
                  type="hidden"
                  name="body"
                  value={JSON.stringify(form.values.body)}
                />
                {isAdmin && (
                  <>
                    <Switch
                      name="locked"
                      checked={form?.values?.locked}
                      size="lg"
                      onLabel="Locked"
                      offLabel="Unlocked"
                      onChange={(event) =>
                        form.setFieldValue(
                          'locked',
                          event.currentTarget.checked
                        )
                      }
                    />
                    <Switch
                      name="pinned"
                      checked={form?.values?.pinned}
                      size="lg"
                      onLabel="Pinned"
                      offLabel="Unpinned"
                      onChange={(event) =>
                        form.setFieldValue(
                          'pinned',
                          event.currentTarget.checked
                        )
                      }
                    />
                  </>
                )}
              </Stack>
              <Group align="center" mt="md">
                <Button color="green" type="submit" variant="light">
                  {id ? 'Update' : 'Save'}
                </Button>
                {closeEditor && <CloseBtn />}
              </Group>
            </Form>
            <DebugCollapse data={form.values} />
          </Card.Section>
        </Card>
      </Grid.Col>
    </Grid>
  );
};
export default CommentEditor;
