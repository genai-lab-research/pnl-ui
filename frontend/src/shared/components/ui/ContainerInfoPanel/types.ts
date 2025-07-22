import { Container } from '../../../types/containers';

export interface ContainerInfoPanelProps {
  /** Container data to display */
  container: Container | null;
  /** Panel title */
  title?: string;
  /** Additional styling props */
  sx?: object;
}