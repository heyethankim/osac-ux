import { type ReactNode, useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import type { Transport } from '@connectrpc/connect';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from 'i18next';

import {
  type MockApiFixtures,
  type MockTransportOverrides,
  createMockConnectTransport,
} from './createMockConnectTransport';
import en from '../../../i18n/locales/en/translation.json';
import { ApiProvider } from '../api/api-context';
import ToastProvider from '../components/Toast/ToastProvider';
import { SessionProvider } from '../hooks/use-session';
import type { UserRole } from '../shellTypes';

/**
 * The application's provider tree, wired to an in-memory Connect transport.
 *
 * This is the single definition shared by the Vitest helpers in
 * `TestProviders.tsx` and by the Storybook decorator in `apps/storybook`. Keep
 * it free of `@testing-library/*` imports so it can be bundled for the browser.
 */
export const createMockI18n = () => {
  const instance = i18n.createInstance();
  instance.init({
    initImmediate: false,
    lng: 'en',
    fallbackLng: 'en',
    resources: { en: { translation: en } },
    interpolation: { escapeValue: false },
  });
  return instance;
};

export type MockSession = {
  role?: UserRole;
  username?: string;
  tenantId?: string;
};

export type MockProvidersProps = {
  children: ReactNode;
  apiFixtures?: MockApiFixtures;
  transport?: Transport;
  transportOverrides?: MockTransportOverrides;
  routerEntries?: string[];
  /**
   * When provided, children are wrapped in a `SessionProvider`. Omit it to keep
   * the legacy behaviour where the caller supplies its own session.
   */
  session?: MockSession;
};

export const MockProviders = ({
  children,
  apiFixtures,
  transport: transportOverride,
  transportOverrides,
  routerEntries,
  session,
}: MockProvidersProps) => {
  const i18nInstance = useMemo(() => createMockI18n(), []);

  // Transport and query client are created together on purpose: swapping
  // fixtures (as a Storybook story does) must not serve data cached from the
  // previous transport.
  const { transport, queryClient } = useMemo(
    () => ({
      transport: transportOverride ?? createMockConnectTransport(apiFixtures, transportOverrides),
      queryClient: new QueryClient({
        defaultOptions: {
          queries: { retry: false, refetchOnWindowFocus: false, refetchInterval: false },
        },
      }),
    }),
    [apiFixtures, transportOverride, transportOverrides],
  );

  const content = session ? (
    <SessionProvider
      role={session.role ?? 'admin'}
      username={session.username ?? 'test-user'}
      tenantId={session.tenantId ?? 'test-tenant'}
    >
      {children}
    </SessionProvider>
  ) : (
    children
  );

  // A data router (rather than a plain <MemoryRouter>) is required so that
  // data-router-only hooks like useBlocker (used by LeaveFormConfirmation) work.
  const router = createMemoryRouter([{ path: '*', element: content }], {
    initialEntries: routerEntries,
  });

  return (
    <I18nextProvider i18n={i18nInstance}>
      <ApiProvider transport={transport}>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </QueryClientProvider>
      </ApiProvider>
    </I18nextProvider>
  );
};

export default MockProviders;
