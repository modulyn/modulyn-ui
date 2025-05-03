import axios from "redaxios";
import { ResponseArray } from "./response-type";
import { queryOptions, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";

type EnvironmentType = {
  id: string;
  name: string;
  projectId: string;
};

type CreateEnvironmentType = {
  name: string;
};

// get environments
const fetchEnvironments = async (projectId: string) => {
  return axios
    .get<
      ResponseArray<EnvironmentType>
    >(`http://localhost:8080/api/v1/projects/${projectId}/environments`)
    .then((r) =>
      r.data.data.map((d) => {
        return {
          ...d,
          projectId: projectId,
        };
      })
    );
};

export const environmentsQueryOptions = (projectId: string) =>
  queryOptions({
    queryKey: ["environments", projectId],
    queryFn: () => fetchEnvironments(projectId),
    enabled: projectId !== "",
  });

// create environment
const createEnvironment = async (
  projectId: string,
  input: CreateEnvironmentType
) => {
  return axios.post(
    `http://localhost:8080/api/v1/projects/${projectId}/environments`,
    input,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const environmentCreateMutation = (projectId: string) =>
  useMutation({
    mutationFn: (input: CreateEnvironmentType) =>
      createEnvironment(projectId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["environments", projectId],
      }),
  });
