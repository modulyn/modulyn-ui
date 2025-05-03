import axios from "redaxios";
import { ResponseArray } from "./response-type";
import { queryOptions } from "@tanstack/react-query";

type ProjectType = {
  id: string;
  name: string;
};

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
