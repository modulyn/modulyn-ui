import { Feature, FeaturesTable } from "@/components/features-table";
import { NewEnvironment } from "@/components/new-environment";
import { NewFeature } from "@/components/new-feature";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { groupBy } from "@/lib/utils";
import { featuresQueryOptions } from "@/services/features";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, PlusIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/projects/$projectId/")({
  component: FeaturesComponent,
  errorComponent: FeaturesErrorComponent,
  pendingComponent: FeaturesPendingComponent,
});

function FeaturesErrorComponent() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Failed to fetch features. Try again later!
      </AlertDescription>
    </Alert>
  );
}

function FeaturesPendingComponent() {
  return (
    <>
      <div className="flex flex-row my-2 justify-between">
        <div className="text-2xl">Features</div>
        <div className="flex flex-row gap-2">
          <Button disabled>
            <PlusIcon /> Add Environment
          </Button>
          <Button disabled>
            <PlusIcon /> Add Feature
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2">
        <Skeleton className="h-22"></Skeleton>
        <Skeleton className="h-22"></Skeleton>
        <Skeleton className="h-22"></Skeleton>
        <Skeleton className="h-22"></Skeleton>
        <Skeleton className="h-22"></Skeleton>
        <Skeleton className="h-22"></Skeleton>
        <Skeleton className="h-22"></Skeleton>
        <Skeleton className="h-22"></Skeleton>
        <Skeleton className="h-22"></Skeleton>
        <Skeleton className="h-22"></Skeleton>
        <Skeleton className="h-22"></Skeleton>
        <Skeleton className="h-22"></Skeleton>
        <Skeleton className="h-22"></Skeleton>
        <Skeleton className="h-22"></Skeleton>
        <Skeleton className="h-22"></Skeleton>
      </div>
    </>
  );
}

function FeaturesComponent() {
  const [openNewEnvironment, setOpenNewEnvironment] = useState(false);
  const [openNewFeature, setOpenNewFeature] = useState(false);
  const { projectId } = Route.useParams();
  const { data: features } = useSuspenseQuery(featuresQueryOptions(projectId));

  const getFeatureTableData = (): Feature[] => {
    if (!features) return [];

    const featuresToReturn: Feature[] = [];
    const groupedFeatures = groupBy(features, (feature) => feature.id);
    Object.entries(groupedFeatures).forEach(([id, featureGroup]) => {
      const environments = featureGroup.map(
        (feature) => feature.environmentName
      );
      featuresToReturn.push({
        id: id,
        name: featureGroup[0].name,
        environments: environments,
      });
    });

    return featuresToReturn;
  };

  return (
    <>
      <span className="text-2xl">{features?.at(0)?.projectName}</span>
      <Tabs defaultValue="features">
        <TabsList>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="targeting">Targeting</TabsTrigger>
        </TabsList>
        <TabsContent value="features">
          <FeaturesTable data={getFeatureTableData()} />
        </TabsContent>
        <TabsContent value="targeting">targeting</TabsContent>
      </Tabs>
      {openNewEnvironment && (
        <NewEnvironment
          open={openNewEnvironment}
          onOpenChange={() => setOpenNewEnvironment(!openNewEnvironment)}
        />
      )}

      {openNewFeature && (
        <NewFeature
          open={openNewFeature}
          onOpenChange={() => setOpenNewFeature(!openNewFeature)}
        />
      )}
    </>
  );
}
