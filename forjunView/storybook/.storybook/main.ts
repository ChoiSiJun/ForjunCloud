import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const config: StorybookConfig = {
  stories: ['../../package/home/src/**/*.stories.@(js|jsx|ts|tsx)', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-onboarding',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [tsconfigPaths({
        projects: [fileURLToPath(new URL('../../package/home/tsconfig.json', import.meta.url))],
      })],
      resolve: {
        alias: {
          '@common': fileURLToPath(new URL('../../package/home/src/common', import.meta.url)),
          '@ui-kit': fileURLToPath(new URL('../../package/home/src/ui-kit', import.meta.url)),
          '@config': fileURLToPath(new URL('../../package/home/src/config', import.meta.url)),
          '@domain': fileURLToPath(new URL('../../package/home/src/domain', import.meta.url)),
          '@pages': fileURLToPath(new URL('../../package/home/src/pages', import.meta.url)),
          '@store': fileURLToPath(new URL('../../package/home/src/store', import.meta.url)),
          '@asset': fileURLToPath(new URL('../../package/home/src/asset', import.meta.url)),
          '@router': fileURLToPath(new URL('../../package/home/src/Router.tsx', import.meta.url)),
        },
      },
    });
  },
};

export default config;
