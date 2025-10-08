export interface FeatureDetail {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  environments: {
    id: string;
    name: string;
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
  }[];
}
