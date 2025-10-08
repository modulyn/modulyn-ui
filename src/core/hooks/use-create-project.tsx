import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectsService } from "../services/projects";

export const useCreateProject = () => {
  const projectsService = new ProjectsService();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => projectsService.createProject(name),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
