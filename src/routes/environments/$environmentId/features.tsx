import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { featuresQueryOptions } from "@/services/features";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, PlusIcon } from "lucide-react";

export const Route = createFileRoute("/environments/$environmentId/features")({
  component: FeaturesComponent,
  errorComponent: FeaturesErrorComponent,
  pendingComponent: FeaturesPendingComponent,
});

function FeaturesErrorComponent() {
  return (
    <div className="flex flex-col pb-2 pl-2 pr-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to fetch features. Try again later!
        </AlertDescription>
      </Alert>
    </div>
  );
}

function FeaturesPendingComponent() {
  return (
    <div className="flex flex-col pb-2 px-2">
      <div className="flex flex-row justify-between gap-2 my-2">
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

      <div className="grid grid-cols-4 gap-2 mt-2 pl-2 pr-4">
        <Skeleton className="h-24"></Skeleton>
        <Skeleton className="h-24"></Skeleton>
        <Skeleton className="h-24"></Skeleton>
        <Skeleton className="h-24"></Skeleton>
        <Skeleton className="h-24"></Skeleton>
        <Skeleton className="h-24"></Skeleton>
      </div>
    </div>
  );
}

function FeaturesComponent() {
  const { environmentId } = Route.useParams();
  const { data } = useSuspenseQuery(featuresQueryOptions(environmentId));
  return (
    <div className="flex flex-col pb-2 px-2">
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

      <div className="grid grid-cols-4 gap-2 mt-2">
        {data.map((project: any) => (
          <Card key={project.id}>
            <CardContent>
              <div>
                Name: <span key={project.id}>{project.name}</span>
              </div>
              <div>
                Name: <span key={project.id}>{project.name}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
