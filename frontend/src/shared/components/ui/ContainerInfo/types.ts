export interface ContainerInfoProps {
  /**
   * Container name
   */
  name: string;
  /**
   * Container type
   */
  type: string;
  /**
   * Container tenant
   */
  tenant: string;
  /**
   * Container purpose
   */
  purpose: string;
  /**
   * Container location
   */
  location: string;
  /**
   * Container status
   */
  status: string;
  /**
   * Container creation date
   */
  created: string;
  /**
   * Container last modified date
   */
  lastModified: string;
  /**
   * Container creator
   */
  creator: string;
  /**
   * Container seed types
   */
  seedTypes: string;
  /**
   * Container notes
   */
  notes: string;
}