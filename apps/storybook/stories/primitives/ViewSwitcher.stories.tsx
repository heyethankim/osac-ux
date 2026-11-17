import type { Meta, StoryObj } from '@storybook/react-vite';

import ViewSwitcher from '@osac/ui-components/components/Primitives/ViewSwitcher';

const meta: Meta<typeof ViewSwitcher> = {
  title: 'Primitives/ViewSwitcher',
  component: ViewSwitcher,
  parameters: {
    docs: {
      description: {
        component:
          'The cards/table toggle. Icon-only, with element-type-free aria-labels ' +
          '("Card view", not "Card view button"). The choice is persisted per page ' +
          'key, so it survives navigation and reload. Click it here and reload the ' +
          'story: the selection sticks.',
      },
    },
  },
  args: { pageKey: 'storybook-demo' },
};

export default meta;

type Story = StoryObj<typeof ViewSwitcher>;

export const Default: Story = {};

/**
 * Two pages, two keys, two independent preferences — the default view is a
 * property of the page. `DEFAULT_VIEW_TYPE` is currently a single global
 * `'cards'`, which puts text-heavy record lists into the layout PatternFly
 * forbids for them (finding F5).
 */
export const IndependentPerPage: Story = {
  render: () => (
    <div className="osac-sb-compare">
      <ViewSwitcher pageKey="storybook-demo-a" />
      <ViewSwitcher pageKey="storybook-demo-b" />
    </div>
  ),
};
