import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUITime } from "@/lib/utils";
import {
  featureQueryOptions,
  featureUpdateMutation,
} from "@/services/features";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, SaveIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute(
  "/projects/$projectId/environments/$environmentId/features/$featureId"
)({
  component: FeatureComponent,
  pendingComponent: FeaturePendingComponent,
  errorComponent: FeatureErrorComponent,
});

function FeatureErrorComponent() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Failed to fetch feature. Try again later!
      </AlertDescription>
    </Alert>
  );
}

function FeaturePendingComponent() {
  return (
    <>
      <Skeleton className="h-12 w-60"></Skeleton>
      <Skeleton className="h-6 w-40"></Skeleton>
      <Skeleton className="h-96 w-full"></Skeleton>
    </>
  );
}

function FeatureComponent() {
  const { projectId, environmentId, featureId } = Route.useParams();
  const { data } = useSuspenseQuery(
    featureQueryOptions(projectId, environmentId, featureId)
  );
  const [featureState, setFeatureState] = useState(data.enabled);
  const { mutate: updateFeature } = featureUpdateMutation(
    projectId,
    environmentId,
    featureId
  );

  const handleFeatureStatusChange = (value: boolean) => {
    setFeatureState(value);
  };

  const handleFeatureSave = () => {
    updateFeature({
      value: featureState,
    });
  };

  return (
    <>
      <div className="flex flex-row justify-between gap-2 my-2">
        <div className="text-2xl">{data.name}</div>
        <div className="flex flex-row gap-2">
          <Button
            onClick={handleFeatureSave}
            disabled={data.enabled === featureState}
          >
            <SaveIcon /> Save
          </Button>
        </div>
      </div>
      <Tabs defaultValue="status">
        <TabsList className="w-full">
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>
        <TabsContent value="status">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 mt-2">
              <Switch
                id="enabled"
                checked={featureState}
                onCheckedChange={handleFeatureStatusChange}
              />
              <div className="text-muted-foreground text-sm">
                Will return{" "}
                <span className="italic">
                  {featureState ? "true" : "false"}
                </span>
              </div>
            </div>
            <table className="table-auto sm:w-full md:w-96">
              <tbody>
                <tr>
                  <td>Created on:</td>
                  <td>{getUITime(data.createdAt)}</td>
                </tr>
                <tr>
                  <td>Last modified on:</td>
                  <td>{getUITime(data.updatedAt)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="configuration">
          <div className="flex flex-col gap-2">Configuration details</div>
        </TabsContent>
      </Tabs>
    </>
  );
}
