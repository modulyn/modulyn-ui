import { queryOptions } from "@tanstack/react-query";
import axios from "redaxios";
import { Response } from "./response-type";

type FeatureType = {
  id: string;
  name: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

const fetchFeatures = async (environmentId: string) => {
  return axios
    .get<
      Response<FeatureType>
    >(`http://localhost:8080/api/v1/features?sdk_key=${environmentId}`)
    .then((r) => r.data.data);
};

export const featuresQueryOptions = (environmentId: string) =>
  queryOptions({
    queryKey: ["features", environmentId],
    queryFn: () => fetchFeatures(environmentId),
  });
