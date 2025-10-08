import axios from "axios";
import type { Feature } from "../models/feature";
import type { Response } from "../models/response";
import type { FeatureDetail } from "../models/feature-detail";
import type { UpdateFeatureRequest } from "../models/update-feature-request";

export class FeaturesService {
  async getFeaturesForProject(
    projectId: string
  ): Promise<FeatureDetail[] | undefined> {
    try {
      var features = await axios
        .get<Response<Feature[]>>(
          `http://localhost:8080/api/v1/projects/${projectId}/features`
        )
        .then((res) => res.data.data);
      // Convert Feature[] to FeatureDetail[]
      const featureDetails: FeatureDetail[] = features.reduce(
        (acc, feature) => {
          let detail = acc.find((fd) => fd.id === feature.id);
          if (!detail) {
            detail = {
              id: feature.id,
              name: feature.name,
              projectId: feature.projectId,
              projectName: feature.projectName,
              environments: [],
            };
            acc.push(detail);
          }
          detail.environments.push({
            id: feature.environmentId,
            name: feature.environmentName,
            enabled: feature.enabled,
            createdAt: feature.createdAt,
            updatedAt: feature.updatedAt,
          });
          return acc;
        },
        [] as FeatureDetail[]
      );

      return featureDetails;
    } catch (error) {
      console.error("Failed to fetch features:", error);
    }
  }

  updateFeatures(
    projectId: string,
    featureId: string,
    updatedFeatures: UpdateFeatureRequest[]
  ) {
    try {
      return axios
        .put(
          `http://localhost:8080/api/v1/projects/${projectId}/features/${featureId}`,
          [...updatedFeatures]
        )
        .then((res) => res.data.data);
    } catch (error) {
      console.error("Failed to update features:", error);
    }
  }
}
