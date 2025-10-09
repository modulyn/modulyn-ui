import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { FeatureDetail } from "@/core/models/feature-detail";
import { Switch } from "@/components/ui/switch";
import { useUpdateFeatures } from "@/core/hooks/use-update-features";
import { useEffect, useState } from "react";
import { CheckIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { useDeleteFeature } from "@/core/hooks/use-delete-feature";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";

export interface FeatureDetailProps {
  data: FeatureDetail;
}

export function FeatureDetail(props: FeatureDetailProps) {
  const { data: feature } = props;
  const [typedFeatureName, setTypedFeatureName] = useState<string>();
  const {
    mutate: updateFeatures,
    isSuccess: isUpdateFeaturesSuccess,
    isError: isUpdateFeaturesError,
    error: updateFeaturesError,
  } = useUpdateFeatures(feature.projectId);
  const {
    mutate: deleteFeature,
    isSuccess: isDeleteFeatureSuccess,
    isError: isDeleteFeatureError,
    error: deleteFeatureError,
  } = useDeleteFeature(feature.projectId);
  const [currentFeatureValues, setCurrentFeatureValues] = useState<
    | {
        environmentId: string;
        enabled: boolean;
        jsonValue?: { key: string; values: string[]; enabled: boolean };
      }[]
  >(
    feature.environments.map((e) => {
      return {
        environmentId: e.id,
        enabled: e.enabled,
      };
    })
  );

  useEffect(() => {
    if (isUpdateFeaturesError) {
      console.error(updateFeaturesError);
      toast.error("Error updating feature");
    }
  }, [isUpdateFeaturesError]);

  useEffect(() => {
    if (isUpdateFeaturesSuccess) {
      toast.success("Successfully updated feature");
    }
  }, [isUpdateFeaturesSuccess]);

  useEffect(() => {
    if (isDeleteFeatureError) {
      console.error(deleteFeatureError);
      toast.error("Error deleting feature");
    }
  }, [isDeleteFeatureError]);

  useEffect(() => {
    if (isDeleteFeatureSuccess) {
      toast.success("Successfully deleted feature");
    }
  }, [isDeleteFeatureSuccess]);

  const handleCheckedChange = (checked: boolean, env: string) => {
    const clonedFeatureValues = [...currentFeatureValues];
    const currentEnvIndex = clonedFeatureValues.findIndex(
      (f) => f.environmentId === env
    );
    const currentEnv = clonedFeatureValues[currentEnvIndex];
    clonedFeatureValues[currentEnvIndex] = {
      ...currentEnv,
      enabled: checked,
    };
    setCurrentFeatureValues(clonedFeatureValues);
  };

  const handleUpdate = () => {
    updateFeatures({
      projectId: feature.projectId,
      featureId: feature.id,
      updatedFeatures: currentFeatureValues,
    });
  };

  const handleDelete = () => {
    deleteFeature({
      projectId: feature.projectId,
      featureId: feature.id,
    });
  };

  return (
    <Card className="mb-2">
      <CardHeader>
        <CardTitle>{feature.name} ({feature.label})</CardTitle>
        <CardDescription>{feature.description}</CardDescription>
        <CardAction>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="cursor-pointer"
                // onClick={handleDelete}
              >
                <TrashIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col w-56 gap-2">
              <div className="text-sm">
                Type the name of the feature to delete
              </div>
              <div className="grid gap-3">
                <Label htmlFor="feature-name">Feature name</Label>
                <Input
                  id="feature-name"
                  type="text"
                  onChange={(e) => setTypedFeatureName(e.target.value)}
                  value={typedFeatureName}
                />
              </div>
              <Button
                disabled={typedFeatureName !== feature.name}
                onClick={handleDelete}
              >
                <TrashIcon /> Delete
              </Button>
            </PopoverContent>
          </Popover>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          {feature.environments.map((env, i) => (
            <div key={env.id} className="flex items-center space-x-2">
              <Switch
                id={env.id}
                checked={currentFeatureValues[i].enabled}
                onCheckedChange={(checked) =>
                  handleCheckedChange(checked, env.id)
                }
              />
              <Label htmlFor={env.id}>{env.name}</Label>
            </div>
          ))}
        </div>
        <Button onClick={handleUpdate} className="cursor-pointer">
          <CheckIcon />
          Save changes
        </Button>
      </CardContent>
    </Card>
  );
}
