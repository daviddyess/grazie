import { HTMLBlockContentEditor } from '~/blocks/HTML/Editor';
import { HTMLBlockContent } from '~/blocks/HTML/Display';
import { RichTextBlockContentEditor } from '~/blocks/RichText/Editor';
import { RichTextBlockContent } from '~/blocks/RichText/Display';

export const BlockEditors = {
  HTMLBlockContentEditor,
  RichTextBlockContentEditor
};

export const BlockContents = {
  HTMLBlockContent,
  RichTextBlockContent
};

export const BlockTypes = {
  html: {
    name: 'HTML',
    Editor: 'HTMLBlockContentEditor',
    Content: 'HTMLBlockContent'
  },
  'rich-text': {
    name: 'Rich Text',
    Editor: 'RichTextBlockContentEditor',
    Content: 'RichTextBlockContent'
  }
};

export const BlockTypesList = Object.keys(BlockTypes);

export default {
  HTMLBlockContentEditor,
  HTMLBlockContent,
  RichTextBlockContentEditor,
  RichTextBlockContent
};
