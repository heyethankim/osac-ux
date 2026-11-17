import { create } from '@bufbuild/protobuf';
import { timestampFromDate } from '@bufbuild/protobuf/wkt';

import {
  type BareMetalInstance,
  BareMetalInstanceSchema,
  BareMetalInstanceState,
  type BareMetalInstanceType,
  BareMetalInstanceTypeSchema,
  type Cluster,
  ClusterSchema,
  ClusterState,
  type ClusterVersion,
  ClusterVersionSchema,
  type ComputeInstance,
  ComputeInstanceSchema,
  ComputeInstanceState,
  type InstanceType,
  InstanceTypeSchema,
  InstanceTypeState,
  type Project,
  ProjectSchema,
} from '@osac/types';

/**
 * Fixtures are deterministic on purpose: a story that renders a different
 * timestamp on every reload cannot be reviewed, screenshotted, or diffed.
 */
const at = (iso: string) => timestampFromDate(new Date(iso));

const CREATED = at('2026-03-04T09:12:00Z');
const CREATED_OLDER = at('2026-01-27T16:45:00Z');

// --- Projects ---------------------------------------------------------------

export const projects: Project[] = [
  create(ProjectSchema, {
    id: 'proj-platform',
    metadata: { name: 'platform', project: '', creationTimestamp: CREATED_OLDER },
  }),
  create(ProjectSchema, {
    id: 'proj-research',
    metadata: { name: 'research', project: '', creationTimestamp: CREATED_OLDER },
  }),
];

// --- Instance types ---------------------------------------------------------

export const instanceTypes: InstanceType[] = [
  create(InstanceTypeSchema, {
    id: 'standard-4-16',
    metadata: { name: 'standard-4-16', creationTimestamp: CREATED_OLDER },
    spec: {
      vcpus: 4,
      memoryGib: 16,
      description: 'General purpose',
      state: InstanceTypeState.ACTIVE,
    },
  }),
  create(InstanceTypeSchema, {
    id: 'gpu-8-64',
    metadata: { name: 'gpu-8-64', creationTimestamp: CREATED_OLDER },
    spec: {
      vcpus: 8,
      memoryGib: 64,
      description: 'Accelerated',
      state: InstanceTypeState.ACTIVE,
      gpu: { count: 1 },
    },
  }),
];

// --- Virtual machines -------------------------------------------------------

interface VmInit {
  id: string;
  name: string;
  state: ComputeInstanceState;
  project?: string;
  instanceTypeId?: string;
  diskImage?: string;
  internalIp?: string;
  externalIp?: string;
  createdAt?: ReturnType<typeof at>;
}

const vm = ({
  id,
  name,
  state,
  project = 'platform',
  instanceTypeId = 'standard-4-16',
  diskImage = 'rhel-9.4',
  internalIp = '10.128.4.21',
  externalIp = '',
  createdAt = CREATED,
}: VmInit): ComputeInstance =>
  create(ComputeInstanceSchema, {
    id,
    metadata: { name, project, creationTimestamp: createdAt },
    spec: {
      instanceType: instanceTypeId ? { id: instanceTypeId, name: instanceTypeId } : undefined,
      diskImage: diskImage ? { id: diskImage, name: diskImage } : undefined,
    },
    status: { state, internalIpAddress: internalIp, externalIpAddress: externalIp },
  });

export const vms: ComputeInstance[] = [
  vm({
    id: 'vm-01',
    name: 'inference-gateway',
    state: ComputeInstanceState.RUNNING,
    instanceTypeId: 'gpu-8-64',
    externalIp: '192.0.2.41',
  }),
  vm({ id: 'vm-02', name: 'build-runner-02', state: ComputeInstanceState.STARTING }),
  vm({ id: 'vm-03', name: 'archive-node', state: ComputeInstanceState.STOPPED }),
  vm({
    id: 'vm-04',
    name: 'telemetry-collector',
    state: ComputeInstanceState.FAILED,
    project: 'research',
  }),
  vm({
    id: 'vm-05',
    name: 'sandbox-win-01',
    state: ComputeInstanceState.PAUSED,
    diskImage: 'windows-server-2022',
  }),
  vm({ id: 'vm-06', name: 'legacy-batch', state: ComputeInstanceState.DELETING }),
];

/**
 * One VM per status, otherwise identical — so a status story compares the
 * status treatment and nothing else.
 */
export const vmInState = (state: ComputeInstanceState, index: number): ComputeInstance =>
  vm({
    id: `vm-state-${index}`,
    name: `inference-gateway-${String(index).padStart(2, '0')}`,
    state,
    instanceTypeId: 'standard-4-16',
    externalIp: '192.0.2.41',
  });

/** Every optional field absent — exercises the `—` / `N/A` placeholder rules. */
export const vmWithMissingValues: ComputeInstance = create(ComputeInstanceSchema, {
  id: 'vm-sparse',
  metadata: { name: 'sparse-instance' },
  spec: {},
  status: { state: ComputeInstanceState.RUNNING },
});

/** 97 characters — exercises truncation and recoverability of the full value. */
export const vmWithLongName: ComputeInstance = vm({
  id: 'vm-long',
  name: 'eu-west-sovereign-inference-gateway-replica-with-an-unreasonably-long-but-legal-dns-label-01',
  state: ComputeInstanceState.RUNNING,
});

// --- Clusters ---------------------------------------------------------------

export const clusterVersions: ClusterVersion[] = [
  create(ClusterVersionSchema, { id: 'ocp-4-20', spec: { version: '4.20.3' } }),
  create(ClusterVersionSchema, { id: 'ocp-4-19', spec: { version: '4.19.11' } }),
];

interface ClusterInit {
  id: string;
  name: string;
  state: ClusterState;
  project?: string;
  versionName?: string;
  nodeSets?: Record<string, { id: string; size: number }>;
  addOns?: string[];
  catalogItemName?: string;
}

const cluster = ({
  id,
  name,
  state,
  project = 'platform',
  versionName = 'ocp-4-20',
  nodeSets = { workers: { id: 'workers', size: 6 } },
  addOns = ['OpenShift AI'],
  catalogItemName = 'OpenShift cluster — standard',
}: ClusterInit): Cluster =>
  create(ClusterSchema, {
    id,
    metadata: { name, project, creationTimestamp: CREATED },
    spec: {
      version: versionName ? { id: versionName, name: versionName } : undefined,
      nodeSets,
      addOnOperators: addOns.map((operator) => ({ id: operator, name: operator })),
      catalogItem: { id: 'ci-cluster-standard', name: catalogItemName },
    },
    status: { state },
  });

export const clusters: Cluster[] = [
  cluster({ id: 'cl-01', name: 'sovereign-prod-01', state: ClusterState.READY }),
  cluster({
    id: 'cl-02',
    name: 'sovereign-stage-01',
    state: ClusterState.PROGRESSING,
    versionName: 'ocp-4-19',
    nodeSets: { workers: { id: 'workers', size: 3 }, infra: { id: 'infra', size: 3 } },
  }),
  cluster({
    id: 'cl-03',
    name: 'research-gpu-01',
    state: ClusterState.FAILED,
    project: 'research',
    addOns: [],
  }),
  cluster({ id: 'cl-04', name: 'retired-edge-01', state: ClusterState.DELETING }),
];

// --- Bare metal -------------------------------------------------------------

export const bareMetalInstanceTypes: BareMetalInstanceType[] = [
  create(BareMetalInstanceTypeSchema, {
    id: 'bm-dense-gpu',
    metadata: { name: 'bm-dense-gpu', creationTimestamp: CREATED_OLDER },
    spec: {
      description: 'Dense accelerator node',
      hardware: {
        cpu: { cores: 128 },
        memory: { totalGb: 2048n },
        accelerators: [{ vendor: 'NVIDIA', model: 'H100' }],
      },
    },
  }),
  create(BareMetalInstanceTypeSchema, {
    id: 'bm-storage',
    metadata: { name: 'bm-storage', creationTimestamp: CREATED_OLDER },
    spec: {
      description: 'Storage node',
      hardware: { cpu: { cores: 64 }, memory: { totalGb: 512n }, accelerators: [] },
    },
  }),
];

interface BareMetalInit {
  id: string;
  name: string;
  state: BareMetalInstanceState;
  project?: string;
  instanceTypeId?: string;
  diskImage?: string;
}

const bareMetal = ({
  id,
  name,
  state,
  project = 'platform',
  instanceTypeId = 'bm-dense-gpu',
  diskImage = 'rhel-9.4',
}: BareMetalInit): BareMetalInstance =>
  create(BareMetalInstanceSchema, {
    id,
    metadata: { name, project, creationTimestamp: CREATED },
    spec: {
      instanceType: instanceTypeId ? { id: instanceTypeId, name: instanceTypeId } : undefined,
      diskImage: diskImage ? { id: diskImage, name: diskImage } : undefined,
      catalogItem: { id: 'ci-bm-dense', name: 'Bare metal — dense GPU' },
    },
    status: { state },
  });

export const bareMetalInstances: BareMetalInstance[] = [
  bareMetal({ id: 'bm-01', name: 'gpu-node-01', state: BareMetalInstanceState.RUNNING }),
  bareMetal({ id: 'bm-02', name: 'gpu-node-02', state: BareMetalInstanceState.PROVISIONING }),
  bareMetal({
    id: 'bm-03',
    name: 'storage-node-01',
    state: BareMetalInstanceState.FAILED,
    instanceTypeId: 'bm-storage',
  }),
  bareMetal({ id: 'bm-04', name: 'drain-node-01', state: BareMetalInstanceState.DELETING }),
];

/** A wall of cards — shows what an unpaginated list does at scale. */
export const manyVms: ComputeInstance[] = Array.from({ length: 120 }, (_, index) =>
  vm({
    id: `vm-bulk-${index}`,
    name: `bulk-worker-${String(index).padStart(3, '0')}`,
    state: [
      ComputeInstanceState.RUNNING,
      ComputeInstanceState.STARTING,
      ComputeInstanceState.STOPPED,
      ComputeInstanceState.FAILED,
    ][index % 4],
  }),
);
