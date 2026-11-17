import { Code, ConnectError } from '@connectrpc/connect';
import { Bullseye, Spinner } from '@patternfly/react-core';
import type { Meta, StoryObj } from '@storybook/react-vite';

import QueryErrorState from '@osac/ui-components/components/Resource/QueryErrorState';
import UnauthorizedErrorState from '@osac/ui-components/components/Resource/UnauthorizedErrorState';

const meta: Meta = {
  title: 'Golden patterns/GP-6 Loading, empty and error states',
  parameters: {
    osac: { canvas: 'component' },
    docs: {
      description: {
        component:
          'Every screen owns four states beyond "ready": loading, error, ' +
          'unauthorized, and empty — and empty splits in two, because "nothing ' +
          'exists yet" and "nothing matches your filter" need different copy and ' +
          'different recourse. Collapsing them into one generic error page is the ' +
          'failure mode this pattern exists to prevent.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Loading: Story = {
  render: () => (
    <Bullseye>
      <Spinner />
    </Bullseye>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A spinner is right for a list, where the shape of the result is unknown. ' +
          'A details page should use skeletons instead, because its layout is known ' +
          'before the data arrives.',
      },
    },
  },
};

/**
 * `QueryErrorState` defaults its title to the generic "An error occurred".
 * Treat `title` as required at every call site: say what failed and what the
 * user can do about it.
 */
export const ErrorDefaultTitle: Story = {
  render: () => (
    <QueryErrorState error={new ConnectError('Connection refused', Code.Unavailable)} mode="page" />
  ),
};

export const ErrorWithSpecificCopy: Story = {
  render: () => (
    <QueryErrorState
      error={new ConnectError('Connection refused', Code.Unavailable)}
      mode="page"
      title="Could not load virtual machines"
      body="The fulfillment service is not reachable. Your instances are unaffected."
      onRetry={() => undefined}
    />
  ),
};

/** Unauthorized is its own state, with its own recourse — not an error page. */
export const Unauthorized: Story = {
  render: () => <UnauthorizedErrorState headingLevel="h1" />,
};
