import type { ReactElement } from 'react';
import { type RenderOptions, type RenderResult, render } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import userEvent from '@testing-library/user-event';

import { MockProviders, type MockProvidersProps, type MockSession } from './MockProviders';

export type TestProvidersProps = MockProvidersProps;
export type TestSession = MockSession;

/**
 * The provider tree used by component tests. It is the same tree Storybook
 * renders — see `MockProviders` — so a story and a test cannot drift apart.
 */
export const TestProviders = MockProviders;

export type RenderWithProvidersOptions = Omit<RenderOptions, 'wrapper'> &
  Omit<MockProvidersProps, 'children'>;

export type RenderWithProvidersResult = RenderResult & {
  user: UserEvent;
};

export const renderWithProviders = (
  ui: ReactElement,
  options: RenderWithProvidersOptions = {},
): RenderWithProvidersResult => {
  const { apiFixtures, transport, transportOverrides, routerEntries, session, ...renderOptions } =
    options;

  const view = render(ui, {
    wrapper: ({ children }) => (
      <MockProviders
        apiFixtures={apiFixtures}
        transport={transport}
        transportOverrides={transportOverrides}
        routerEntries={routerEntries}
        session={session}
      >
        {children}
      </MockProviders>
    ),
    ...renderOptions,
  });

  return { ...view, user: userEvent.setup() };
};
