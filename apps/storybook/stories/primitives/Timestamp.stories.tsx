import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Timestamp } from '@osac/ui-components/components/Primitives/Timestamp';

const SAMPLE = '2026-03-04T09:12:00Z';

const meta: Meta<typeof Timestamp> = {
  title: 'Primitives/Timestamp',
  component: Timestamp,
  parameters: {
    docs: {
      description: {
        component:
          'The single way a date is rendered. It emits `<time dateTime>` so the ' +
          'value stays machine-readable, and falls back to `—` (the value exists ' +
          'but cannot be shown) rather than a plain hyphen. Never write a local ' +
          'date formatter beside it.',
      },
    },
  },
  args: { value: SAMPLE },
};

export default meta;

type Story = StoryObj<typeof Timestamp>;

export const Default: Story = {};

export const AllFormats: Story = {
  render: () => (
    <DescriptionList isHorizontal isCompact>
      <DescriptionListGroup>
        <DescriptionListTerm>Full (default)</DescriptionListTerm>
        <DescriptionListDescription>
          <Timestamp value={SAMPLE} />
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Date</DescriptionListTerm>
        <DescriptionListDescription>
          <Timestamp value={SAMPLE} format="Date" />
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Time</DescriptionListTerm>
        <DescriptionListDescription>
          <Timestamp value={SAMPLE} format="Time" />
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Missing value</DescriptionListTerm>
        <DescriptionListDescription>
          <Timestamp value={undefined} />
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`Full` is 24-hour and `Time` is 12-hour, and both are hard-coded to ' +
          '`en-US` rather than the active i18n locale. One component, two clock ' +
          'conventions — see finding F3.',
      },
    },
  },
};
