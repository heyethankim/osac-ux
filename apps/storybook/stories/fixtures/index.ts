import type { MockApiFixtures } from '@osac/ui-components/test-utils/createMockConnectTransport';

import { bareMetalCatalogItems, clusterCatalogItems, vmCatalogItems } from './catalog';
import {
  bareMetalInstanceTypes,
  bareMetalInstances,
  clusterVersions,
  clusters,
  instanceTypes,
  manyVms,
  projects,
  vms,
} from './instances';

export * from './catalog';
export * from './instances';
export * from './transports';

/**
 * The fixture set every instance-list story shares, so switching `kind`
 * compares the three pages on equivalent data rather than on whatever each
 * story happened to seed.
 */
export const instanceListFixtures: MockApiFixtures = {
  computeInstances: vms,
  instanceTypes,
  clusters,
  clusterVersions,
  bareMetalInstances,
  bareMetalInstanceTypes,
  projects,
};

export const emptyInstanceFixtures: MockApiFixtures = {
  computeInstances: [],
  instanceTypes,
  clusters: [],
  clusterVersions,
  bareMetalInstances: [],
  bareMetalInstanceTypes,
  projects,
};

export const bulkInstanceFixtures: MockApiFixtures = {
  ...instanceListFixtures,
  computeInstances: manyVms,
};

/**
 * Provisioning wizards start at the catalog step, so every GP-3 story needs
 * catalog items as well as the instance types the later steps select from.
 */
export const provisioningFixtures: MockApiFixtures = {
  ...instanceListFixtures,
  catalogItems: vmCatalogItems,
  clusterCatalogItems,
  bareMetalInstanceCatalogItems: bareMetalCatalogItems,
};

/** The wizard with nothing to provision from — its first step has no options. */
export const emptyCatalogFixtures: MockApiFixtures = {
  ...instanceListFixtures,
  catalogItems: [],
  clusterCatalogItems: [],
  bareMetalInstanceCatalogItems: [],
};
