import type { StorybookConfig } from '@storybook/react-vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Alias } from 'vite';

const here = fileURLToPath(new URL('.', import.meta.url));
const uiComponentsSrc = resolve(here, '../../../libs/ui-components/src');

/**
 * The `@osac/ui-components` alias must stay identical to the one in
 * `apps/app-frontend/vite.config.ts` and `apps/app-frontend/vitest.config.ts`.
 * A divergent alias makes Storybook render a different component tree than the
 * application, which defeats the point of a golden-pattern reference.
 */
const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    // Air-gap rule: never phone home from a build that runs inside the
    // sovereign boundary.
    disableTelemetry: true,
  },
  typescript: {
    // react-docgen keeps the Controls table honest about each component's props.
    reactDocgen: 'react-docgen-typescript',
  },
  viteFinal: (viteConfig) => {
    const existing = viteConfig.resolve?.alias;
    const inherited: Alias[] = Array.isArray(existing) ? (existing as Alias[]) : [];

    return {
      ...viteConfig,
      resolve: {
        ...viteConfig.resolve,
        alias: [
          ...inherited,
          { find: /^@osac\/ui-components\/(.+)$/, replacement: `${uiComponentsSrc}/$1` },
        ],
      },
    };
  },
};

export default config;
