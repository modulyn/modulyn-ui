import { useQuery } from "@tanstack/react-query";
import { FeaturesService } from "../services/features";

export const useFeaturesOfProject = (
  isEnabled: boolean,
  searchTerm: string,
  projectId?: string
) => {
  const featuresService = new FeaturesService();
  return useQuery({
    queryKey: ["features", projectId],
    queryFn: async () =>
      featuresService.getFeaturesForProject(projectId!, searchTerm),
    enabled: isEnabled && !!projectId,
  });
};
