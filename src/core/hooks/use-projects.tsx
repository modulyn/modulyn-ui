import { useQuery } from "@tanstack/react-query";
import { ProjectsService } from "../services/projects";

export const useProjects = () => {
  const projectsService = new ProjectsService();
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => projectsService.getProjects(),
  });
};
