import { FeatureCard } from "@/components/feature-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { featuresQueryOptions } from "@/services/features";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle, PlusIcon } from "lucide-react";

export const Route = createFileRoute(
  "/projects/$projectId/environments/$environmentId/features/"
)({
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
      </div>
    </>
  );
}

function FeaturesComponent() {
  const { environmentId, projectId } = Route.useParams();
  const navigate = useNavigate();
  const { data } = useSuspenseQuery(featuresQueryOptions(environmentId));

  const handleFeatureNavigate = (featureId: string) => {
    navigate({
      to: "/projects/$projectId/environments/$environmentId/features/$featureId",
      params: {
        environmentId: environmentId,
        projectId: projectId,
        featureId: featureId,
      },
    });
  };

  return (
    <>
      <div className="flex flex-row justify-between gap-2 my-2">
        <div className="text-2xl">Features</div>
        <div className="flex flex-row gap-2">
          <Button>
            <PlusIcon /> Add Environment
          </Button>
          <Button>
            <PlusIcon /> Add Feature
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {data.map((feature) => (
          <FeatureCard
            key={feature.id}
            id={feature.id}
            name={feature.name}
            enabled={feature.enabled}
            updatedAt={feature.updatedAt}
            onFeatureClick={handleFeatureNavigate}
          />
        ))}
      </div>
    </>
  );
}
