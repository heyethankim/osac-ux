import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { BareMetalInstanceCreateWizard } from '@osac/ui-components/components/BareMetalInstance/CreateWizard/BareMetalInstanceCreateWizard';
import { ClusterCreateWizard } from '@osac/ui-components/components/Cluster/CreateWizard/ClusterCreateWizard';
import { VmCreateWizard } from '@osac/ui-components/components/vm/CreateWizard/VmCreateWizard';
import { BareMetalCreatePage } from '@osac/ui-components/pages/tenant/BareMetalCreatePage';
import { ClusterCreatePage } from '@osac/ui-components/pages/tenant/ClusterCreatePage';
import { VmCreatePage } from '@osac/ui-components/pages/tenant/VmCreatePage';

import { emptyCatalogFixtures, pendingTransport, provisioningFixtures } from '../fixtures';

type InstanceKind = 'vm' | 'cluster' | 'bm';

const PAGES: Record<InstanceKind, ComponentType> = {
  vm: VmCreatePage,
  cluster: ClusterCreatePage,
  bm: BareMetalCreatePage,
};

const WIZARDS: Record<InstanceKind, ComponentType<WizardHarnessProps>> = {
  vm: VmCreateWizard,
  cluster: ClusterCreateWizard,
  bm: BareMetalInstanceCreateWizard,
};

interface WizardHarnessProps {
  initialCatalogItemId?: string;
  onProvision: (payload: unknown) => void | Promise<void>;
  onClosed?: () => void;
}

interface WizardArgs {
  kind: InstanceKind;
}

/** The whole screen: page shell plus wizard, exactly as the route renders it. */
const CreateInstancePage = ({ kind }: WizardArgs) => {
  const Page = PAGES[kind];
  return <Page />;
};

const noop = () => undefined;

const meta: Meta<WizardArgs> = {
  title: 'Golden patterns/GP-3 Create instance wizard',
  component: CreateInstancePage,
  parameters: {
    osac: { canvas: 'page', apiFixtures: provisioningFixtures },
    docs: {
      description: {
        component: [
          'The canonical flow for provisioning an instance from a catalog item.',
          '',
          '```',
          'Create page shell       PageSection + Breadcrumb + h1 + description',
          '└── <Kind>CreateWizard  thin: instantiates the kind adapter, nothing else',
          '    └── ProvisioningWizard   Formik + step order + cancel guard + footer',
          '        └── Wizard isVisitRequired',
          '            └── WizardStep per ordered step',
          '                └── step body: validation alert, provision error, step fields',
          '```',
          '',
          'This is the pattern the product gets *right*: one shared ' +
            '`ProvisioningWizard` owns all orchestration, and each kind contributes ' +
            'only an adapter — step components, validation schema, payload builder. ' +
            'Adding a fourth provisionable resource means writing an adapter, not ' +
            'another wizard.',
          '',
          'Step order is per kind and declared in one place (`stepIds.ts`): a VM gets ' +
            'Select template → Details → Compute configuration → Storage → Networking ' +
            '→ Access & Initial Run → Review; a cluster swaps in Cluster version and ' +
            'drops Storage; bare metal is the short form. Switch `kind` to compare.',
          '',
          '### Create-time states are not storied, on purpose',
          '',
          'Provisioning is slow — minutes to hours — so the wizard locks every footer ' +
            'button and spins the Create button while the call is in flight, and on ' +
            'failure keeps the user on Review with the form intact and the server ' +
            'message inline (`ProvisioningWizard.tsx`, `pending` and `provisionError`).',
          '',
          'There is no story for either, because `onProvision` only fires from the ' +
            'Review step and reaching Review means completing every required field in ' +
            'between. A story that faked those two states by hand-rendering the alert ' +
            'and a spinner would be exactly the kind of replica this Storybook exists ' +
            'to avoid — it would keep passing after the real ones broke. Walk the ' +
            'wizard to see them.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    kind: {
      control: 'inline-radio',
      options: ['vm', 'cluster', 'bm'],
      description: 'Which instance type’s create flow to render',
    },
  },
  args: { kind: 'vm' },
};

export default meta;

type Story = StoryObj<WizardArgs>;

/**
 * Step one. Nothing can be configured until a catalog item is chosen, which is
 * why `catalogItemId` is also what the unsaved-changes guard keys on.
 */
export const CatalogStep: Story = {};

/**
 * The three create pages side by side (switch `kind`) show that the shell is
 * hand-rolled three times — and that the headings disagree: "Create virtual
 * machine" against "Launch instance for cluster" and "Launch instance for bare
 * metal". One concept, two verbs. The adapter already carries
 * `wizardTitleKey`, `wizardDescriptionKey` and `breadcrumbCreateLabelKey`, so
 * the shared shell this wants has its data available already. See finding F11.
 */
export const PageShellComparison: Story = {
  args: { kind: 'cluster' },
};

/** Catalog items still loading — the first step cannot offer anything yet. */
export const Loading: Story = {
  parameters: { osac: { canvas: 'page', transport: pendingTransport(provisioningFixtures) } },
};

/**
 * No catalog items published. A tenant with an empty catalog cannot provision
 * anything, so this state has to explain itself rather than show an empty list.
 */
export const EmptyCatalog: Story = {
  parameters: { osac: { canvas: 'page', apiFixtures: emptyCatalogFixtures } },
};

/**
 * Deep link from the catalog page: `/vms/create/:catalogItemId` preselects the
 * item and applies its defaults to the form. The catalog cards are a
 * `radiogroup`, so the preselection is exposed as `aria-checked` rather than
 * colour alone.
 */
export const DeepLinkedFromCatalog: Story = {
  render: () => (
    <VmCreateWizard initialCatalogItemId="ci-vm-general" onProvision={noop} onClosed={noop} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checked = await canvas.findByRole('radio', { checked: true });
    await expect(checked).toHaveAccessibleName(/vm-general-purpose/);
  },
};

/**
 * Picking a catalog item satisfies step one, so Next advances to Details —
 * where the wizard stops again, because Details has required fields of its
 * own. Each step validates independently; `isVisitRequired` stops the nav from
 * being used to skip ahead.
 */
export const AdvancesWhenStepIsValid: Story = {
  render: () => <VmCreateWizard onProvision={noop} onClosed={noop} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(await canvas.findByRole('radio', { name: /vm-general-purpose/ }));
    await userEvent.click(await canvas.findByRole('button', { name: 'Next' }));

    // Step two is reached...
    await expect(await canvas.findByText('Name')).toBeVisible();
    // ...and step two refuses to advance while its own fields are empty.
    await userEvent.click(await canvas.findByRole('button', { name: 'Next' }));
    await expect(
      await canvas.findByText('Fix the highlighted errors before continuing.'),
    ).toBeVisible();
  },
};

/**
 * Next is blocked until the step validates, and the errors only appear *after*
 * the first failed attempt — `FieldValidationProvider showErrors` keeps a
 * pristine form quiet. The inline danger alert is the step-level announcement.
 */
export const ValidationBlocksNext: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const next = await canvas.findByRole('button', { name: 'Next' });
    await userEvent.click(next);
    await expect(
      await canvas.findByText('Fix the highlighted errors before continuing.'),
    ).toBeVisible();
  },
};

/**
 * Cancelling after a catalog item is chosen must not silently throw the work
 * away. The guard is `hasWizardUnsavedProgress`, and Escape routes through the
 * same path as the Cancel button.
 */
export const UnsavedChangesGuard: Story = {
  render: () => (
    <VmCreateWizard initialCatalogItemId="ci-vm-general" onProvision={noop} onClosed={noop} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: 'Cancel' }));

    const dialog = await within(document.body).findByRole('dialog');
    await expect(within(dialog).getByText('Discard wizard progress?')).toBeVisible();
    await expect(within(dialog).getByRole('button', { name: 'Keep editing' })).toBeVisible();
    await expect(within(dialog).getByRole('button', { name: 'Discard and close' })).toBeVisible();
  },
  parameters: {
    docs: {
      description: {
        story:
          'The destructive choice — "Discard and close" — is rendered `variant="primary"`, ' +
          'and sits to the right of the safe one. PatternFly reserves the danger ' +
          'variant for the action that loses work. See finding F12.',
      },
    },
  },
};

/**
 * The same wizard under the Role global. Provisioning is tenant-facing, so a
 * cloud provider admin and a tenant user should not see different affordances
 * here — switch Role in the toolbar and confirm nothing shifts.
 */
export const WizardOnly: Story = {
  render: ({ kind }) => {
    const Wizard = WIZARDS[kind];
    return <Wizard onProvision={noop} onClosed={noop} />;
  },
  parameters: {
    docs: {
      description: {
        story:
          'The wizard without the page shell, which is how a future shared ' +
          '`CreateInstancePage` would compose it.',
      },
    },
  },
};
