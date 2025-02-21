import { TypographyStylesProvider } from '@mantine/core';

export const HTMLBlockContent = ({ content }) => {
  return (
    <TypographyStylesProvider pl={0} mb={0}>
      <div
        dangerouslySetInnerHTML={{
          __html: content
        }}
      />
    </TypographyStylesProvider>
  );
};
