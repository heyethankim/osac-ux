import type { Transport } from '@connectrpc/connect';

import type {
  MockApiFixtures,
  MockTransportOverrides,
} from '@osac/ui-components/test-utils/createMockConnectTransport';
import type { MockSession } from '@osac/ui-components/test-utils/MockProviders';

/**
 * Per-story wiring, set as `parameters.osac`. Everything here feeds the same
 * `MockProviders` tree the Vitest suite uses.
 */
export interface OsacStoryParameters {
  /** Protobuf fixtures served by the in-memory Connect router. */
  apiFixtures?: MockApiFixtures;
  /** A hand-built transport -- used for the loading and failure states. */
  transport?: Transport;
  /** Per-RPC overrides on top of `apiFixtures`. */
  transportOverrides?: MockTransportOverrides;
  /** Initial memory-router entries, for stories that read URL filter params. */
  routerEntries?: string[];
  /** Session defaults; the toolbar's role global takes precedence. */
  session?: MockSession;
  /**
   * `page` removes canvas padding for full-page patterns; `component` adds
   * spacing so shadows and focus rings are visible.
   */
  canvas?: 'page' | 'component';
}
