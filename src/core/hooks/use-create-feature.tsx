import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FeaturesService } from "../services/features";

export const useCreateFeature = () => {
  const featuresService = new FeaturesService();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      projectId: string;
      description?: string;
    }) =>
      featuresService.addFeature(data.name, data.projectId, data.description),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["features"] });
    },
  });
};
