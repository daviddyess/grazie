/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { RichTextEditor, Link } from '@mantine/tiptap';
import {
  IconBlockquote,
  IconBold,
  IconCode,
  IconH1,
  IconH2,
  IconH3,
  IconH4,
  IconH5,
  IconH6,
  IconItalic,
  IconList,
  IconListNumbers,
  IconSourceCode,
  IconUnderline
} from '@tabler/icons-react';
import { useEditor } from '@tiptap/react';
import { Highlight } from '@tiptap/extension-highlight';
import { StarterKit } from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Superscript } from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import YouTube from '@tiptap/extension-youtube';
import YouTubeEmbed from './Extensions/YouTube';
import classes from './Tiptap.module.css';

const iconStroke = 1.7;
const iconSize = 18;

const BlockquoteIcon = () => (
  <IconBlockquote size={iconSize} stroke={iconStroke} />
);
const BoldIcon = () => <IconBold size={iconSize} stroke={iconStroke} />;
const CodeIcon = () => <IconCode size={iconSize} stroke={iconStroke} />;
const H1Icon = () => <IconH1 size={iconSize} stroke={iconStroke} />;
const H2Icon = () => <IconH2 size={iconSize} stroke={iconStroke} />;
const H3Icon = () => <IconH3 size={iconSize} stroke={iconStroke} />;
const H4Icon = () => <IconH4 size={iconSize} stroke={iconStroke} />;
const H5Icon = () => <IconH5 size={iconSize} stroke={iconStroke} />;
const H6Icon = () => <IconH6 size={iconSize} stroke={iconStroke} />;
const ItalicIcon = () => <IconItalic size={iconSize} stroke={iconStroke} />;
const ListIcon = () => <IconList size={iconSize} stroke={iconStroke} />;
const ListNumbersIcon = () => (
  <IconListNumbers size={iconSize} stroke={iconStroke} />
);
const SourceCodeIcon = () => (
  <IconSourceCode size={iconSize} stroke={iconStroke} />
);
const UnderlineIcon = () => (
  <IconUnderline size={iconSize} stroke={iconStroke} />
);

export default function Default({
  name,
  form,
  withSearch = false
}: {
  name: string;
  form: any;
  withSearch?: boolean;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      YouTube.configure({ width: 280, height: 158 })
    ],
    content: form?.values?.[name] ?? '',
    onUpdate({ editor }) {
      form.setFieldValue(name, editor?.getJSON());
      if (withSearch) {
        form.setFieldValue('search', editor?.getText());
      }
    }
  });

  return (
    <RichTextEditor
      editor={editor}
      classNames={{
        toolbar: classes.toolbar,
        content: classes.content,
        control: classes.control
      }}
    >
      <RichTextEditor.Toolbar sticky stickyOffset={60}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold icon={BoldIcon} />
          <RichTextEditor.Italic icon={ItalicIcon} />
          <RichTextEditor.Underline icon={UnderlineIcon} />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code icon={CodeIcon} />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 icon={H1Icon} />
          <RichTextEditor.H2 icon={H2Icon} />
          <RichTextEditor.H3 icon={H3Icon} />
          <RichTextEditor.H4 icon={H4Icon} />
          <RichTextEditor.H5 icon={H5Icon} />
          <RichTextEditor.H6 icon={H6Icon} />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.CodeBlock icon={SourceCodeIcon} />
          <RichTextEditor.Blockquote icon={BlockquoteIcon} />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList icon={ListIcon} />
          <RichTextEditor.OrderedList icon={ListNumbersIcon} />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <YouTubeEmbed />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
