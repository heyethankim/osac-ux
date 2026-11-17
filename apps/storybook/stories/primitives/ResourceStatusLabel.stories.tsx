import { Flex, FlexItem } from '@patternfly/react-core';
import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  ResourceStatusLabel,
  type StatusKind,
} from '@osac/ui-components/components/Resource/ResourceStatusLabel';

const STATUSES: { status: StatusKind; text: string }[] = [
  { status: 'ready', text: 'Running' },
  { status: 'progressing', text: 'Starting' },
  { status: 'failed', text: 'Failed' },
  { status: 'unspecified', text: 'Unknown' },
];

const meta: Meta<typeof ResourceStatusLabel> = {
  title: 'Primitives/ResourceStatusLabel',
  component: ResourceStatusLabel,
  parameters: {
    docs: {
      description: {
        component:
          'Status answers "what is this resource doing?". Severity answers "how bad ' +
          'is it?" — they are different scales and are not interchangeable. The ' +
          'colour is always carried by a text label as well, so the meaning survives ' +
          'for a colour-blind user and in high contrast. Check this story against ' +
          'the Theme and Contrast toolbar settings.',
      },
    },
  },
  args: { status: 'ready', text: 'Running' },
};

export default meta;

type Story = StoryObj<typeof ResourceStatusLabel>;

export const Default: Story = {};

/** The four kinds. The component defaults to `noIcon` — text plus colour. */
export const AllStatuses: Story = {
  render: () => (
    <Flex gap={{ default: 'gapSm' }}>
      {STATUSES.map(({ status, text }) => (
        <FlexItem key={status}>
          <ResourceStatusLabel status={status} text={text} />
        </FlexItem>
      ))}
    </Flex>
  ),
};

/** With icons. The icon is `aria-hidden`; the label text carries the meaning. */
export const WithIcons: Story = {
  render: () => (
    <Flex gap={{ default: 'gapSm' }}>
      {STATUSES.map(({ status, text }) => (
        <FlexItem key={status}>
          <ResourceStatusLabel status={status} text={text} noIcon={false} />
        </FlexItem>
      ))}
    </Flex>
  ),
};
