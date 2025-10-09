import {
  Card,
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
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";

export interface FeatureDetailProps {
  data: FeatureDetail;
}

export function FeatureDetail(props: FeatureDetailProps) {
  const { data: feature } = props;
  const {
    mutate: updateFeatures,
    isSuccess: isUpdateFeaturesSuccess,
    isError: isUpdateFeaturesError,
    error: updateFeaturesError,
  } = useUpdateFeatures(feature.projectId);
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
    console.log("toUpdate: ", {
      projectId: feature.projectId,
      featureId: feature.id,
      updatedFeatures: currentFeatureValues,
    });
    updateFeatures({
      projectId: feature.projectId,
      featureId: feature.id,
      updatedFeatures: currentFeatureValues,
    });
  };

  return (
    <Card className="mb-2">
      <CardHeader>
        <CardTitle>{feature.name}</CardTitle>
        <CardDescription>{feature.description}</CardDescription>
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
