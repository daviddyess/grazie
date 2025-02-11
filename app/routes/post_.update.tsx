/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router'; // or cloudflare/deno
import { redirectWithToast } from 'remix-toast';
import {
  getCategories,
  postCategory,
  purgePostCategories
} from '~/lib/category.server';
import { getPost, updatePost } from '~/lib/post.server';
import { createAbility } from '~/utils/session.server';
import { site } from '@/grazie';
import { sentry } from '~/lib/sentry.server';

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'create', subject: 'Post' });
  const categories = await getCategories({});
  const data = { categories };

  return data;
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const id = Number(form.get('id') as string);
  const published = form.get('published') === 'on' ? true : false;
  const publishedAt = form.get('publishedAt') as string;
  const slugFormat = form.get('slugFormat') as string;
  const slug = form.get('slug') as string;
  const metaData = form.get('meta') as string;
  let meta;
  if (metaData) {
    meta = JSON.parse(metaData);
  }

  const postCheck = await getPost({ id, slug });

  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, {
    action: 'update',
    subject: 'Post',
    item: postCheck
  });

  const post = await updatePost({
    id,
    published,
    publishedAt,
    body: form.get('body') as string,
    search: form.get('search') as string,
    title: form.get('title') as string,
    slugFormat,
    slug,
    meta: meta ? JSON.stringify(meta) : null
  });

  const categories = form.get('categories') as string;
  // Delete Post's Categories
  await purgePostCategories({ postId: id });
  // Assign Current Categories
  if (categories) {
    const cats = categories.split(',');

    for (const cat of cats) {
      // Prefer to use 'slug', but TagsInput displays the 'value' as the 'label', so we use 'name' here
      await postCategory({ name: cat, postId: post.id });
    }
  }

  if (post?.slug) {
    return redirectWithToast(`/post/${post.slug}`, {
      message: 'Post Updated!',
      type: 'success'
    });
  } else return post;
}
