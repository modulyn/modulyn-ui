import { useQuery } from "@tanstack/react-query";
import { EnvironmentsService } from "../services/environments";

export const useEnvironments = (projectId: string) => {
  const environmentsService = new EnvironmentsService();
  return useQuery({
    queryKey: ["environments", projectId],
    queryFn: async () => environmentsService.getEnvironments(projectId),
  });
};
