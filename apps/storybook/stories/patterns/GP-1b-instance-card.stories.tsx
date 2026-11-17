import { Gallery, GalleryItem } from '@patternfly/react-core';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { ComputeInstanceState } from '@osac/types';
import BareMetalCard from '@osac/ui-components/components/BareMetalInstance/BareMetalCard';
import ClusterCard from '@osac/ui-components/components/Cluster/ClusterCard';
import VmCard from '@osac/ui-components/components/vm/VmCard';

import {
  bareMetalInstanceTypes,
  bareMetalInstances,
  clusterVersions,
  clusters,
  instanceListFixtures,
  instanceTypes,
  vmInState,
  vmWithLongName,
  vmWithMissingValues,
  vms,
} from '../fixtures';

const CARD_WIDTH = { default: '20.875rem' };

const meta: Meta = {
  title: 'Golden patterns/GP-1b Instance card',
  parameters: {
    osac: { canvas: 'component', apiFixtures: instanceListFixtures },
    docs: {
      description: {
        component:
          'One shape of card, so a VM, a cluster and a bare metal instance read as ' +
          'the same kind of object. Header: decorative kind icon, status label, ' +
          'actions menu. Body: linked name, a subtitle, and two to four ' +
          'distinguishing spec rows. Divider. Footer: the fixed Project and Created ' +
          'rows, plus at most one primary action.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

const vmInstanceType = (id?: string) => instanceTypes.find((type) => type.id === id);

/** The reference shape. Read it top to bottom: header, name, specs, footer. */
export const Anatomy: Story = {
  render: () => (
    <Gallery hasGutter minWidths={CARD_WIDTH} maxWidths={CARD_WIDTH}>
      <GalleryItem>
        <VmCard vm={vms[0]} instanceType={vmInstanceType(vms[0].spec?.instanceType?.id)} />
      </GalleryItem>
    </Gallery>
  ),
};

/**
 * The comparison that matters. Three cards, one row — every divergence in
 * icon treatment, subtitle, spec-row count and footer action is visible here
 * rather than buried in three files.
 */
export const ThreeKinds: Story = {
  render: () => (
    <div className="osac-sb-compare">
      <VmCard vm={vms[0]} instanceType={vmInstanceType(vms[0].spec?.instanceType?.id)} />
      <ClusterCard cluster={clusters[0]} clusterVersion={clusterVersions[0]} />
      <BareMetalCard instance={bareMetalInstances[0]} instanceType={bareMetalInstanceTypes[0]} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Two divergences are visible at a glance. (1) The VM title renders at body ' +
          'size while cluster and bare metal render at `heading--lg` — those two bump ' +
          'it from their own CSS file using a PatternFly utility class as a selector ' +
          'hook (finding F10). (2) Cluster and bare metal end in a full-width ' +
          '`variant="primary"` button; PatternFly specifies a secondary button for a ' +
          'single inline card action, and a primary button in every card competes with ' +
          'the page’s one real primary action, Create (finding F2). All three are ' +
          'hand-built from `Card` with their own BEM stylesheet rather than composing a ' +
          'shared instance card (finding F6).',
      },
    },
  },
};

/** Every status the VM card can show, in one frame. */
export const StatusVariants: Story = {
  render: () => (
    <div className="osac-sb-compare">
      {[
        ComputeInstanceState.RUNNING,
        ComputeInstanceState.STARTING,
        ComputeInstanceState.STOPPED,
        ComputeInstanceState.FAILED,
        ComputeInstanceState.PAUSED,
        ComputeInstanceState.DELETING,
      ].map((state, index) => (
        <VmCard key={state} vm={vmInState(state, index)} instanceType={instanceTypes[0]} />
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Status labels are text plus colour, never colour alone, and never an ' +
          'icon on its own. `Deleting` also suppresses the actions menu and the ' +
          'name link, because the resource is on its way out.',
      },
    },
  },
};

/**
 * Every optional field absent. `N/A` means not applicable; `—` means the value
 * exists but cannot be shown. They are not interchangeable.
 */
export const MissingValues: Story = {
  render: () => (
    <Gallery hasGutter minWidths={CARD_WIDTH} maxWidths={CARD_WIDTH}>
      <GalleryItem>
        <VmCard vm={vmWithMissingValues} />
      </GalleryItem>
    </Gallery>
  ),
};

/** A 97-character name. The full value must stay recoverable. */
export const LongName: Story = {
  render: () => (
    <Gallery hasGutter minWidths={CARD_WIDTH} maxWidths={CARD_WIDTH}>
      <GalleryItem>
        <VmCard vm={vmWithLongName} instanceType={instanceTypes[0]} />
      </GalleryItem>
    </Gallery>
  ),
};

export const ClusterCards: Story = {
  render: () => (
    <div className="osac-sb-compare">
      {clusters.map((cluster) => (
        <ClusterCard
          key={cluster.id}
          cluster={cluster}
          clusterVersion={clusterVersions.find(
            (version) => version.id === cluster.spec?.version?.name,
          )}
        />
      ))}
    </div>
  ),
};

/**
 * Note the CPU and RAM rows: "128 cores_other", "2048 GB_other". The plural
 * keys in `locales/en/translation.json` carry their own `_other` suffix as the
 * translated value, so the suffix is rendered to the user. The running
 * application shows the same thing. See finding F9.
 */
export const BareMetalCards: Story = {
  render: () => (
    <div className="osac-sb-compare">
      {bareMetalInstances.map((instance) => (
        <BareMetalCard
          key={instance.id}
          instance={instance}
          instanceType={bareMetalInstanceTypes.find(
            (type) => type.id === instance.spec?.instanceType?.id,
          )}
        />
      ))}
    </div>
  ),
};
