import MantineEditor from '~/components/Tiptap/Editor';

export const RichTextBlockContentEditor = ({ form }: { form: any }) => {
  return (
    <>
      <MantineEditor name="content" form={form} />
      <input
        type="hidden"
        name="content"
        value={JSON.stringify(form.values.content)}
      />
    </>
  );
};
