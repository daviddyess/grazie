import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
  build: {
    cssMinify: true,
    ssr: true
  },
  server: {
    warmup: {
      clientFiles: [
        './app/components/**/*.{js,jsx,ts,tsx}',
        './app/hooks/**/*.{js,jsx,ts,tsx}'
      ],
      ssrFiles: [
        './app/lib/**/*.{js,jsx,ts,tsx}',
        './app/routes/**/*.{js,jsx,ts,tsx}'
      ]
    }
  },
  optimizeDeps: {
    include: [
      '@mantine/charts',
      '@mantine/core',
      '@mantine/dates',
      '@mantine/dropzone',
      '@mantine/form',
      '@mantine/hooks',
      '@mantine/modals',
      '@mantine/notifications',
      '@mantine/nprogress',
      '@mantine/spotlight',
      '@mantine/tiptap',
      '@prisma/client',
      '@react-router/node',
      '@tabler/icons-react',
      '@tiptap/core',
      'react',
      'react-dom',
      'react-router',
      'recharts',
      'remix-toast',
      'sharp',
      'systeminformation',
      'winston'
    ]
  }
});
