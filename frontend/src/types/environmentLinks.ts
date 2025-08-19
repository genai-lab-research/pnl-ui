/**
 * Environment Links Data Models
 * Based on p2_datamodels.md and p2_routing.md specifications
 */

// Environment Link Configuration
export interface EnvironmentLink {
  container_id: number;
  fa: FAEnvironmentConfig;
  pya: PYAEnvironmentConfig;
  aws: AWSEnvironmentConfig;
  mbai: MBAIEnvironmentConfig;
  fh: FHEnvironmentConfig;
}

// FA (Farm Automation) Environment Configuration
export interface FAEnvironmentConfig {
  endpoint_url?: string;
  api_key?: string;
  device_mappings?: FADeviceMapping[];
  automation_rules?: FAAutomationRule[];
  sync_enabled?: boolean;
  last_sync?: string;
}

export interface FADeviceMapping {
  local_device_id: string;
  fa_device_id: string;
  device_type: string;
  sync_status: 'active' | 'inactive' | 'error';
  last_sync: string;
}

export interface FAAutomationRule {
  id: string;
  name: string;
  trigger_condition: string;
  action: string;
  enabled: boolean;
  priority: number;
}

// PYA (Python Analytics) Environment Configuration
export interface PYAEnvironmentConfig {
  notebook_server_url?: string;
  api_token?: string;
  analysis_pipelines?: PYAAnalysisPipeline[];
  data_export_settings?: PYADataExportSettings;
  compute_resources?: PYAComputeResources;
}

export interface PYAAnalysisPipeline {
  id: string;
  name: string;
  description: string;
  script_path: string;
  schedule: string;
  enabled: boolean;
  last_run: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
}

export interface PYADataExportSettings {
  format: 'csv' | 'json' | 'parquet';
  include_metadata: boolean;
  compression: boolean;
  schedule: string;
}

export interface PYAComputeResources {
  cpu_cores: number;
  memory_gb: number;
  gpu_enabled: boolean;
  max_runtime_minutes: number;
}

// AWS Environment Configuration
export interface AWSEnvironmentConfig {
  region?: string;
  access_key_id?: string;
  secret_access_key?: string; // This should be encrypted/hidden in real apps
  s3_bucket?: string;
  iot_core_endpoint?: string;
  lambda_functions?: AWSLambdaFunction[];
  cloudwatch_settings?: AWSCloudWatchSettings;
}

export interface AWSLambdaFunction {
  function_name: string;
  function_arn: string;
  trigger_events: string[];
  enabled: boolean;
  last_invocation: string;
}

export interface AWSCloudWatchSettings {
  log_group: string;
  metric_namespace: string;
  retention_days: number;
  alarm_notifications: boolean;
}

// MBAI (Machine Learning/Business Analytics Intelligence) Environment
export interface MBAIEnvironmentConfig {
  ml_platform_url?: string;
  api_key?: string;
  models?: MBAIModel[];
  training_datasets?: MBAIDataset[];
  inference_settings?: MBAIInferenceSettings;
}

export interface MBAIModel {
  id: string;
  name: string;
  version: string;
  type: 'classification' | 'regression' | 'clustering' | 'forecasting';
  status: 'training' | 'ready' | 'deployed' | 'deprecated';
  accuracy?: number;
  last_trained: string;
}

export interface MBAIDataset {
  id: string;
  name: string;
  size_mb: number;
  features: string[];
  last_updated: string;
  quality_score?: number;
}

export interface MBAIInferenceSettings {
  auto_inference: boolean;
  batch_size: number;
  confidence_threshold: number;
  fallback_model?: string;
}

// FH (Food Hub) Environment Configuration
export interface FHEnvironmentConfig {
  marketplace_url?: string;
  vendor_id?: string;
  api_credentials?: FHAPICredentials;
  product_catalog?: FHProduct[];
  order_settings?: FHOrderSettings;
  logistics?: FHLogisticsSettings;
}

export interface FHAPICredentials {
  client_id: string;
  client_secret: string; // Should be encrypted/hidden
  oauth_token?: string;
  token_expires_at?: string;
}

export interface FHProduct {
  sku: string;
  name: string;
  category: string;
  price_per_unit: number;
  unit_type: 'kg' | 'lbs' | 'piece' | 'bunch';
  availability: boolean;
  harvest_source_container?: number;
}

export interface FHOrderSettings {
  auto_list_harvest: boolean;
  minimum_quantity: number;
  pricing_strategy: 'fixed' | 'market' | 'premium';
  quality_grade: 'A' | 'B' | 'C';
}

export interface FHLogisticsSettings {
  pickup_location: string;
  pickup_schedule: string[];
  packaging_requirements: string[];
  cold_chain_required: boolean;
}

// Request/Response types for API operations
export interface UpdateEnvironmentLinksRequest {
  fa?: Partial<FAEnvironmentConfig>;
  pya?: Partial<PYAEnvironmentConfig>;
  aws?: Partial<AWSEnvironmentConfig>;
  mbai?: Partial<MBAIEnvironmentConfig>;
  fh?: Partial<FHEnvironmentConfig>;
}

export interface EnvironmentLinksResponse {
  container_id: number;
  fa: FAEnvironmentConfig;
  pya: PYAEnvironmentConfig;
  aws: AWSEnvironmentConfig;
  mbai: MBAIEnvironmentConfig;
  fh: FHEnvironmentConfig;
  last_updated: string;
  sync_status: EnvironmentSyncStatus;
}

export interface EnvironmentSyncStatus {
  fa: 'connected' | 'disconnected' | 'error' | 'syncing';
  pya: 'connected' | 'disconnected' | 'error' | 'syncing';
  aws: 'connected' | 'disconnected' | 'error' | 'syncing';
  mbai: 'connected' | 'disconnected' | 'error' | 'syncing';
  fh: 'connected' | 'disconnected' | 'error' | 'syncing';
  last_sync_attempt: string;
  next_sync_scheduled: string;
}

// Environment connection test results
export interface EnvironmentConnectionTest {
  environment_type: 'fa' | 'pya' | 'aws' | 'mbai' | 'fh';
  status: 'success' | 'failure' | 'timeout';
  response_time_ms: number;
  error_message?: string;
  tested_at: string;
}

export interface BulkEnvironmentConnectionTest {
  container_id: number;
  test_results: EnvironmentConnectionTest[];
  overall_status: 'all_connected' | 'partial' | 'all_disconnected';
  tested_at: string;
}
