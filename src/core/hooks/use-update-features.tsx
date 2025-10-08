import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FeaturesService } from "../services/features";
import type { UpdateFeatureRequest } from "../models/update-feature-request";

export const useUpdateFeatures = (projectId: string) => {
  const featuresService = new FeaturesService();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      projectId: string;
      featureId: string;
      updatedFeatures: UpdateFeatureRequest[];
    }) =>
      featuresService.updateFeatures(
        data.projectId,
        data.featureId,
        data.updatedFeatures
      ),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["features", projectId] });
    },
  });
};
