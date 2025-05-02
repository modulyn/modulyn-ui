import axios from "redaxios";
import { Response } from "./response-type";
import { queryOptions } from "@tanstack/react-query";

type EnvironmentType = {
  id: string;
  name: string;
};

const fetchEnvironments = async (projectId: string) => {
  return axios
    .get<
      Response<EnvironmentType>
    >(`http://localhost:8080/api/v1/environments?project_id=${projectId}`)
    .then((r) => r.data.data);
};

export const environmentsQueryOptions = (projectId: string) =>
  queryOptions({
    queryKey: ["environments", projectId],
    queryFn: () => fetchEnvironments(projectId),
    enabled: false,
  });
