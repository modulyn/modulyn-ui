import { queryOptions, useMutation } from "@tanstack/react-query";
import axios from "redaxios";
import { ResponseArray, Response } from "./response-type";
import { queryClient } from "@/main";

type FeatureType = {
  id: string;
  name: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

type UpdateFeatureType = {
  id: string;
  environmentId: string;
  value: boolean;
};

// get features
const fetchFeatures = async (environmentId: string) => {
  return axios
    .get<
      ResponseArray<FeatureType>
    >(`http://localhost:8080/api/v1/features?sdk_key=${environmentId}`)
    .then((r) => r.data.data);
};

export const featuresQueryOptions = (environmentId: string) =>
  queryOptions({
    queryKey: ["features", environmentId],
    queryFn: () => fetchFeatures(environmentId),
  });

// update feature
const updateFeature = async (input: UpdateFeatureType) => {
  return axios.put(`http://localhost:8080/api/v1/features`, input, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const featureUpdateMutation = (
  environmentId: string,
  featureId: string
) =>
  useMutation({
    mutationFn: (input: UpdateFeatureType) => updateFeature(input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["environment", environmentId, "feature", featureId],
      }),
  });

// get feature
const fetchFeature = async (environmentId: string, featureId: string) => {
  return axios
    .get<
      Response<FeatureType>
    >(`http://localhost:8080/api/v1/environments/${environmentId}/features/${featureId}`)
    .then((r) => r.data.data);
};

export const featureQueryOptions = (environmentId: string, featureId: string) =>
  queryOptions({
    queryKey: ["environment", environmentId, "feature", featureId],
    queryFn: () => fetchFeature(environmentId, featureId),
  });
