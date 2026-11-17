import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  CLUSTERS_VIEW_KEY,
  ClustersPage,
} from '@osac/ui-components/components/Cluster/ClustersPage';
import {
  type ViewType,
  getViewTypePrefKey,
} from '@osac/ui-components/components/Primitives/ViewSwitcher';
import {
  BARE_METAL_VIEW_KEY,
  BareMetalListPage,
} from '@osac/ui-components/pages/tenant/BareMetalListPage';
import { VMS_VIEW_KEY, VmListPage } from '@osac/ui-components/pages/tenant/VmListPage';

import {
  bulkInstanceFixtures,
  emptyInstanceFixtures,
  failingTransport,
  instanceListFixtures,
  pendingTransport,
  unauthorizedTransport,
} from '../fixtures';

type InstanceKind = 'vm' | 'cluster' | 'bm';

const PAGES: Record<InstanceKind, { Page: ComponentType; viewKey: string }> = {
  vm: { Page: VmListPage, viewKey: VMS_VIEW_KEY },
  cluster: { Page: ClustersPage, viewKey: CLUSTERS_VIEW_KEY },
  bm: { Page: BareMetalListPage, viewKey: BARE_METAL_VIEW_KEY },
};

interface InstanceListArgs {
  kind: InstanceKind;
  viewType: ViewType;
}

/**
 * Renders the real page component — not a replica. Whatever the three pages
 * do differently shows up here as a difference between two stories.
 */
const InstanceListView = ({ kind }: InstanceListArgs) => {
  const { Page } = PAGES[kind];
  return <Page />;
};

const meta: Meta<InstanceListArgs> = {
  title: 'Golden patterns/GP-1 Instance list view',
  component: InstanceListView,
  parameters: {
    osac: { canvas: 'page', apiFixtures: instanceListFixtures },
    docs: {
      description: {
        component:
          'The canonical collection screen for an instance the user operates: ' +
          'virtual machine, cluster, bare metal. Cards by default because provisioning ' +
          'is slow and the common task is watching state; a table for comparison. ' +
          'Switch `kind` to compare the three implementations on identical data.',
      },
    },
  },
  argTypes: {
    kind: {
      control: 'inline-radio',
      options: ['vm', 'cluster', 'bm'],
      description: 'Which instance type’s list page to render',
    },
    viewType: {
      control: 'inline-radio',
      options: ['cards', 'list'],
      description: 'Persisted per-page view preference, as the ViewSwitcher writes it',
    },
  },
  args: { kind: 'vm', viewType: 'cards' },
  // The view preference lives in localStorage under `<pageKey>-view-type`;
  // seed it so the story is deterministic on a cold load.
  beforeEach: ({ args }) => {
    const { kind, viewType } = args;
    Object.values(PAGES).forEach(({ viewKey }) => {
      localStorage.setItem(getViewTypePrefKey(viewKey), viewType);
    });
    localStorage.setItem(getViewTypePrefKey(PAGES[kind].viewKey), viewType);
  },
};

export default meta;

type Story = StoryObj<InstanceListArgs>;

/** Default view. Status is prominent, each card carries one obvious action. */
export const CardsView: Story = {
  args: { viewType: 'cards' },
};

/**
 * The same filtered result set, drawn as rows. Switching the view must never
 * change *which* items are shown — only how they are drawn.
 */
export const ListView: Story = {
  args: { viewType: 'list' },
};

export const Loading: Story = {
  parameters: { osac: { canvas: 'page', transport: pendingTransport(instanceListFixtures) } },
};

/** `ListPageBody` routes the error to `QueryErrorState mode="page"`. */
export const Error: Story = {
  parameters: {
    osac: { canvas: 'page', transport: failingTransport(instanceListFixtures) },
  },
};

/**
 * Unauthorized is a distinct state with its own recourse — never a generic
 * error. The interceptor converts `Unauthenticated` before the query sees it.
 */
export const Unauthorized: Story = {
  parameters: {
    osac: { canvas: 'page', transport: unauthorizedTransport(instanceListFixtures) },
  },
};

/**
 * Nothing exists yet. The copy should say how to create the first one.
 *
 * On the VM page it does not — see `EmptyNoMatch` and finding F8.
 */
export const EmptyNoData: Story = {
  parameters: { osac: { canvas: 'page', apiFixtures: emptyInstanceFixtures } },
};

/**
 * Nothing matches the active filter. This must read differently from
 * `EmptyNoData` and offer a different recourse — "clear your filters", not
 * "create your first one".
 *
 * **It does not.** Put this story and `EmptyNoData` side by side: on the VM
 * page both render the identical sentence "Choose one or more filters above to
 * filter virtual machines." The condition at `VmListPage.tsx:227` tests only
 * whether a *select* filter is active, so it short-circuits for an empty
 * product and for a no-match search alike. "No virtual machines yet. Create
 * one to get started." is unreachable, and the search message only appears
 * when a select filter happens to be open. See finding F8.
 */
export const EmptyNoMatch: Story = {
  parameters: {
    osac: {
      canvas: 'page',
      apiFixtures: instanceListFixtures,
      routerEntries: ['/?search=no-such-instance-name'],
    },
  },
};

/**
 * 120 instances on one page. There is no `Pagination` anywhere in the product,
 * so every list renders unbounded — this story is the evidence (finding F1).
 */
export const UnpaginatedAtScale: Story = {
  args: { kind: 'vm' },
  parameters: { osac: { canvas: 'page', apiFixtures: bulkInstanceFixtures } },
};
