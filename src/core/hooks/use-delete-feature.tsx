import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FeaturesService } from "../services/features";

export const useDeleteFeature = (projectId: string) => {
  const featuresService = new FeaturesService();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { projectId: string; featureId: string }) =>
      featuresService.deleteFeature(data.projectId, data.featureId),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["features", projectId] });
    },
  });
};
