import { Code, ConnectError, type Transport } from '@connectrpc/connect';

import { Capabilities } from '@osac/types';
import {
  type MockApiFixtures,
  createMockConnectTransport,
  wrapWithAuthInterceptor,
} from '@osac/ui-components/test-utils/createMockConnectTransport';

/**
 * `SessionProvider` fetches capabilities before it renders anything. A
 * transport that fails every call therefore shows the *session's* error, not
 * the screen's — so the failure transports below let the capabilities call
 * through and break only the resource calls underneath it.
 */
const isSessionCall = (method: unknown): boolean => {
  const parent = (method as { parent?: { typeName?: string } } | undefined)?.parent;
  return parent?.typeName === Capabilities.typeName;
};

type Delegate = () => Promise<never>;

const delegatingTransport = (base: Transport, onResourceCall: Delegate): Transport => ({
  unary(method, signal, timeoutMs, header, input, contextValues) {
    return isSessionCall(method)
      ? base.unary(method, signal, timeoutMs, header, input, contextValues)
      : onResourceCall();
  },
  stream(method, signal, timeoutMs, header, input, contextValues) {
    return isSessionCall(method)
      ? base.stream(method, signal, timeoutMs, header, input, contextValues)
      : onResourceCall();
  },
});

/**
 * Resource calls never settle, so the screen stays in its loading state for as
 * long as the story is open. No timing hack, no flake.
 */
export const pendingTransport = (fixtures: MockApiFixtures = {}): Transport =>
  delegatingTransport(createMockConnectTransport(fixtures), () => new Promise<never>(() => {}));

/** Resource calls fail; the session still resolves, so the page owns the error. */
export const failingTransport = (
  fixtures: MockApiFixtures = {},
  message = 'The fulfillment service did not respond.',
  code: Code = Code.Unavailable,
): Transport =>
  delegatingTransport(createMockConnectTransport(fixtures), () =>
    Promise.reject(new ConnectError(message, code)),
  );

/**
 * Resource calls fail with `Unauthenticated`, wrapped in the same interceptor
 * the application installs, so `QueryErrorState` resolves to the dedicated
 * `UnauthorizedErrorState` rather than a generic error.
 */
export const unauthorizedTransport = (fixtures: MockApiFixtures = {}): Transport =>
  wrapWithAuthInterceptor(
    failingTransport(fixtures, 'Your session has expired.', Code.Unauthenticated),
  );
