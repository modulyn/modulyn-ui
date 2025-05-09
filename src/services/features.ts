import { queryOptions, useMutation } from "@tanstack/react-query";
import axios from "redaxios";
import { ResponseArray, Response } from "./response-type";
import { queryClient } from "@/main";
import { toast } from "sonner";

type FeatureType = {
  id: string;
  name: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

type UpdateFeatureType = {
  enabled: boolean;
};

type CreateFeatureType = {
  name: string;
};

// get features
const fetchFeatures = async (projectId: string, environmentId: string) => {
  return axios
    .get<
      ResponseArray<FeatureType>
    >(`http://localhost:8080/api/v1/projects/${projectId}/environments/${environmentId}/features`)
    .then((r) => r.data.data);
};

export const featuresQueryOptions = (
  projectId: string,
  environmentId: string
) =>
  queryOptions({
    queryKey: ["features", projectId, environmentId],
    queryFn: () => fetchFeatures(projectId, environmentId),
  });

// update feature
const updateFeature = async (
  projectId: string,
  environmentId: string,
  featureId: string,
  input: UpdateFeatureType
) => {
  return axios.put(
    `http://localhost:8080/api/v1/projects/${projectId}/environments/${environmentId}/features/${featureId}`,
    input,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const featureUpdateMutation = (
  projectId: string,
  environmentId: string,
  featureId: string
) =>
  useMutation({
    mutationFn: (input: UpdateFeatureType) =>
      updateFeature(projectId, environmentId, featureId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["features", projectId, environmentId, featureId],
      });
      toast.success("Success", {
        description: "Feature updated successfully",
      });
    },
  });

// get feature
const fetchFeature = async (
  projectId: string,
  environmentId: string,
  featureId: string
) => {
  return axios
    .get<
      Response<FeatureType>
    >(`http://localhost:8080/api/v1/projects/${projectId}/environments/${environmentId}/features/${featureId}`)
    .then((r) => r.data.data);
};

export const featureQueryOptions = (
  projectId: string,
  environmentId: string,
  featureId: string
) =>
  queryOptions({
    queryKey: ["features", projectId, environmentId, featureId],
    queryFn: () => fetchFeature(projectId, environmentId, featureId),
  });

// create feature
const createFeature = async (
  projectId: string,
  environmentId: string,
  input: CreateFeatureType
) => {
  return axios.post(
    `http://localhost:8080/api/v1/projects/${projectId}/environments/${environmentId}/features`,
    input,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const featureCreateMutation = (
  projectId: string,
  environmentId: string
) =>
  useMutation({
    mutationFn: (input: CreateFeatureType) =>
      createFeature(projectId, environmentId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["features", projectId, environmentId],
      });
      toast.success("Success", {
        description: `Feature ${variables.name} created successfully`,
      });
    },
  });
