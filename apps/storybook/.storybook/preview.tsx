/* eslint-disable import/order */
/*
 * Import order here is a CSS cascade, not a style preference, so the
 * import/order rule is off for this file. PatternFly's base stylesheet defines
 * the tokens that preview.css and every component stylesheet then consume, so
 * it has to be evaluated first; `./decorators` pulls in components that carry
 * their own CSS and must therefore come after it.
 *
 * Parity with apps/app-frontend/src/main.tsx, which likewise imports only
 * base.css -- Storybook deliberately does not add patternfly-addons.css (see
 * stories/Introduction.mdx, finding F4).
 */
import type { Preview } from '@storybook/react-vite';

import '@patternfly/react-core/dist/styles/base.css';
import './preview.css';

import { withProviders, withTheme } from './decorators';

const preview: Preview = {
  // Order matters: withTheme is outermost so the theme classes are on the
  // document before the provider tree measures anything.
  decorators: [withProviders, withTheme],

  globalTypes: {
    theme: {
      description: 'PatternFly colour scheme',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    contrast: {
      description: 'PatternFly contrast mode',
      toolbar: {
        title: 'Contrast',
        icon: 'mirror',
        items: [
          { value: 'glass', title: 'Glass (default)' },
          { value: 'default', title: 'Traditional' },
          { value: 'contrast', title: 'High contrast' },
        ],
        dynamicTitle: true,
      },
    },
    role: {
      description: 'Signed-in role — drives permission-gated actions and navigation',
      toolbar: {
        title: 'Role',
        icon: 'user',
        items: [
          { value: 'tenant-admin', title: 'Tenant admin' },
          { value: 'tenant-user', title: 'Tenant user' },
          { value: 'tenant-idp-manager', title: 'IdP manager' },
          { value: 'admin', title: 'Cloud provider admin' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    theme: 'light',
    contrast: 'glass',
    role: 'tenant-admin',
  },

  parameters: {
    layout: 'fullscreen',
    // PatternFly owns the surface colour through its theme tokens; Storybook's
    // own background switcher would fight it.
    backgrounds: { disable: true },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: {
      // Report violations in the panel rather than failing the render. A clean
      // axe run is a floor, not a passing grade -- most WCAG 2.2 AA criteria
      // are manual, which is why each pattern page carries a manual checklist.
      test: 'todo',
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Golden patterns',
          [
            'GP-1 Instance list view',
            'GP-1b Instance card',
            'GP-3 Create instance wizard',
            'GP-6 Loading, empty and error states',
          ],
          'Primitives',
        ],
      },
    },
  },
};

export default preview;
