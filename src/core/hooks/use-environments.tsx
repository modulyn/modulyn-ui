import { useQuery } from "@tanstack/react-query";
import { EnvironmentsService } from "../services/environments";

export const useEnvironments = (isEnabled: boolean, projectId?: string) => {
  const environmentsService = new EnvironmentsService();
  return useQuery({
    queryKey: ["environments", projectId],
    queryFn: async () => environmentsService.getEnvironments(projectId!),
    enabled: isEnabled && !!projectId,
  });
};
