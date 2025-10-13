import axios from "axios";
import type { Feature } from "../models/feature";
import type { Response } from "../models/response";
import type { FeatureDetail } from "../models/feature-detail";
import type { UpdateFeatureRequest } from "../models/update-feature-request";

export class FeaturesService {
  async getFeaturesForProject(
    projectId: string,
    searchTerm: string
  ): Promise<FeatureDetail[] | undefined> {
    try {
      let params = null;
      if (searchTerm !== "") {
        params = {
          search: searchTerm,
        };
      }
      var features = await axios
        .get<Response<Feature[]>>(
          `http://localhost:8080/api/v1/projects/${projectId}/features`,
          {
            params: params,
          }
        )
        .then((res) => res.data.data);
      const featureDetails: FeatureDetail[] = features.reduce(
        (acc, feature) => {
          let detail = acc.find((fd) => fd.id === feature.id);
          if (!detail) {
            detail = {
              id: feature.id,
              name: feature.name,
              label: feature.label,
              description: feature.description,
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

  deleteFeature(projectId: string, featureId: string) {
    try {
      return axios
        .delete(
          `http://localhost:8080/api/v1/projects/${projectId}/features/${featureId}`
        )
        .then((res) => res.data.data);
    } catch (error) {
      console.error("Failed to delete feature:", error);
    }
  }

  addFeature(name: string, projectId: string, description?: string) {
    try {
      return axios
        .post(`http://localhost:8080/api/v1/projects/${projectId}/features`, {
          name: name,
          description: description,
        })
        .then((res) => res.data.data);
    } catch (error) {
      console.error("Failed to create features:", error);
    }
  }
}
