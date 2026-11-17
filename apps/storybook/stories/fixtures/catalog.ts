import { create } from '@bufbuild/protobuf';
import { timestampFromDate } from '@bufbuild/protobuf/wkt';

import {
  type BareMetalInstanceCatalogItem,
  BareMetalInstanceCatalogItemSchema,
  type ClusterCatalogItem,
  ClusterCatalogItemSchema,
  type ComputeInstanceCatalogItem,
  ComputeInstanceCatalogItemSchema,
} from '@osac/types';

const CREATED = timestampFromDate(new Date('2026-01-27T16:45:00Z'));

/**
 * Catalog items are the first step of every provisioning wizard — without them
 * the wizard cannot leave step one, so every GP-3 story needs these.
 */
export const vmCatalogItems: ComputeInstanceCatalogItem[] = [
  create(ComputeInstanceCatalogItemSchema, {
    id: 'ci-vm-general',
    metadata: { name: 'vm-general-purpose', project: 'platform', creationTimestamp: CREATED },
    title: 'General purpose virtual machine',
    description: 'RHEL 9 on balanced CPU and memory. Suitable for most workloads.',
    published: true,
  }),
  create(ComputeInstanceCatalogItemSchema, {
    id: 'ci-vm-gpu',
    metadata: { name: 'vm-gpu-inference', project: 'platform', creationTimestamp: CREATED },
    title: 'GPU inference virtual machine',
    description: 'RHEL 9 with an NVIDIA accelerator attached, for model serving.',
    published: true,
  }),
];

export const clusterCatalogItems: ClusterCatalogItem[] = [
  create(ClusterCatalogItemSchema, {
    id: 'ci-cluster-standard',
    metadata: { name: 'cluster-standard', project: 'platform', creationTimestamp: CREATED },
    title: 'OpenShift cluster — standard',
    description: 'Three control plane nodes and a configurable worker pool.',
    published: true,
  }),
];

export const bareMetalCatalogItems: BareMetalInstanceCatalogItem[] = [
  create(BareMetalInstanceCatalogItemSchema, {
    id: 'ci-bm-dense',
    metadata: { name: 'bm-dense-gpu', project: 'platform', creationTimestamp: CREATED },
    title: 'Bare metal — dense GPU',
    description: 'Eight-accelerator node for training and large-scale inference.',
    published: true,
  }),
];
