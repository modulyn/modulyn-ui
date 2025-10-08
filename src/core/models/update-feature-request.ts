export interface UpdateFeatureRequest {
  environmentId: string;
  enabled: boolean;
  jsonValue?: {
    key: string;
    values: string[];
    enabled: boolean;
  };
}
