export interface ContainerEditEvent {
  type: 'container_edit_started' | 'container_edit_completed' | 'container_edit_failed';
  payload: {
    containerName?: string;
    containerId?: number;
    error?: string;
  };
}
