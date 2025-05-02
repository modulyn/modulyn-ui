import axios from "redaxios";
import { Response } from "./response-type";
import { queryOptions } from "@tanstack/react-query";

type ProjectType = {
  id: string;
  name: string;
};

const fetchProjects = async () => {
  return axios
    .get<Response<ProjectType>>("http://localhost:8080/api/v1/projects")
    .then((r) => r.data.data);
};

export const projectsQueryOptions = () =>
  queryOptions({
    queryKey: ["projects"],
    queryFn: () => fetchProjects(),
  });
