/**
 * Environment & Recipes Tab Data Models
 * Based on p5_datamodels.md specification
 */

// Connection Details
export interface ConnectionDetails {
  fa?: Record<string, any>;
  pya?: Record<string, any>;
  aws?: Record<string, any>;
  mbai?: Record<string, any>;
  fh?: Record<string, any>;
  system_version: string;
}

// Environment Status
export interface EnvironmentStatus {
  is_connected: boolean;
  environment_system?: string;
  iframe_url?: string;
  external_url?: string;
  last_sync?: string;
  connection_details?: ConnectionDetails;
}

// Environment Links
export interface EnvironmentLinks {
  container_id: number;
  fa?: Record<string, any>;
  pya?: Record<string, any>;
  aws?: Record<string, any>;
  mbai?: Record<string, any>;
  fh?: Record<string, any>;
}

// Container Context
export interface ContainerContext {
  container_id: number;
  environment_id: string;
}

// Iframe Configuration
export interface IframeConfiguration {
  iframe_url: string;
  expires_at: string;
  permissions: string[];
  container_context: ContainerContext;
}

// External URL Configuration
export interface ExternalUrlConfiguration {
  external_url: string;
  expires_at: string;
  session_token: string;
}

// Environment Connection Request
export interface EnvironmentConnectionRequest {
  environment_system: string;
  fa?: Record<string, any>;
  pya?: Record<string, any>;
  aws?: Record<string, any>;
  mbai?: Record<string, any>;
  fh?: Record<string, any>;
  user_permissions: string[];
}

// Environment Connection Response
export interface EnvironmentConnectionResponse {
  success: boolean;
  message: string;
  connection_id?: string;
  iframe_url?: string;
  external_url?: string;
  estimated_setup_time?: number;
}

// Maintenance Window
export interface MaintenanceWindow {
  scheduled: boolean;
  start_time?: string;
  end_time?: string;
  reason?: string;
}

// Environment System Health
export interface EnvironmentSystemHealth {
  status: 'healthy' | 'degraded' | 'down' | 'maintenance';
  last_heartbeat: string;
  response_time_ms: number;
  system_version: string;
  features_available: string[];
  maintenance_window?: MaintenanceWindow;
}

// Session Refresh Response
export interface SessionRefreshResponse {
  success: boolean;
  new_iframe_url?: string;
  new_external_url?: string;
  expires_at?: string;
  session_id?: string;
}

// Placeholder State
export interface PlaceholderState {
  message: string;
  can_connect: boolean;
  connection_options?: string[];
}

// Update Environment Links Request
export interface UpdateEnvironmentLinksRequest {
  fa?: Record<string, any>;
  pya?: Record<string, any>;
  aws?: Record<string, any>;
  mbai?: Record<string, any>;
  fh?: Record<string, any>;
}

// Update Environment Links Response
export interface UpdateEnvironmentLinksResponse {
  success: boolean;
  message: string;
  updated_at: string;
}