export interface ContainerCreationEvent {
  type: 'container_creation_started' | 'container_creation_completed' | 'container_creation_failed';
  payload: {
    containerName?: string;
    containerId?: number;
    error?: string;
  };
}

export interface EcosystemEnvironment {
  name: string;
  label: string;
  available: boolean;
}

export interface EcosystemSettings {
  fa: EcosystemEnvironment[];
  pya: EcosystemEnvironment[];
  aws: EcosystemEnvironment[];
  mbai: EcosystemEnvironment[];
}
