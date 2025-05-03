import axios from "redaxios";
import { ResponseArray } from "./response-type";
import { queryOptions, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/main";

type ProjectType = {
  id: string;
  name: string;
};

type CreateProjectType = {
  name: string;
};

// get projects
const fetchProjects = async () => {
  return axios
    .get<ResponseArray<ProjectType>>("http://localhost:8080/api/v1/projects")
    .then((r) => r.data.data);
};

export const projectsQueryOptions = () =>
  queryOptions({
    queryKey: ["projects"],
    queryFn: () => fetchProjects(),
  });

// create project
const createProject = async (input: CreateProjectType) => {
  return axios.post(`http://localhost:8080/api/v1/projects`, input, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const projectCreateMutation = () =>
  useMutation({
    mutationFn: (input: CreateProjectType) => createProject(input),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      }),
  });
