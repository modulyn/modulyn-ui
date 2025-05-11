import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tag, TagsInput } from "@/components/ui/tags-input";
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
        Failed to fetch details. Try again later!
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
  const [defaultFeatureValue, setDefaultFeatureValue] = useState(data.enabled);
  const [jsonValueEnabled, setJsonValueEnabled] = useState(
    data.jsonValue.enabled
  );
  const { mutate: updateFeature } = featureUpdateMutation(
    projectId,
    environmentId,
    featureId
  );
  const [key, setKey] = useState(data.jsonValue.key);
  const [tags, setTags] = useState<Tag[]>(
    data.jsonValue.values?.map((v) => {
      return {
        id: v,
        name: v,
      };
    }) ?? []
  );

  const handleFeatureSave = () => {
    updateFeature({
      enabled: defaultFeatureValue,
      jsonValue: {
        key: key,
        values: tags.map((t) => t.name),
        enabled: jsonValueEnabled,
      },
    });
  };

  function arrayEquals(arr1: string[], arr2: string[]) {
    if (arr1 == null && arr2 != null) {
      return false;
    }

    if (arr1?.length !== arr2?.length) {
      return false;
    }
    return arr1?.every((element, index) => element === arr2?.[index]);
  }

  return (
    <>
      <div className="flex flex-row justify-between gap-2 my-2">
        <div className="text-2xl">{data.name}</div>
        <div className="flex flex-row gap-2">
          <Button
            onClick={handleFeatureSave}
            disabled={
              data.enabled === defaultFeatureValue &&
              data.jsonValue.enabled === jsonValueEnabled &&
              data.jsonValue.key === key &&
              arrayEquals(
                data.jsonValue.values ?? [],
                tags.map((t) => t.name)
              )
            }
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
          <div className="flex flex-col gap-4 mt-4">
            <div className="grid grid-cols-12 items-start">
              <Label htmlFor="values" className="col-span-2">
                Default value
              </Label>
              <div className="grid grid-rows-2 col-span-10">
                <Switch
                  id="enabled"
                  checked={defaultFeatureValue}
                  className="col-span-10"
                  onCheckedChange={(checked) => setDefaultFeatureValue(checked)}
                />
                <div className="text-muted-foreground text-sm">
                  Will return{" "}
                  <span className="italic">
                    {defaultFeatureValue ? "true" : "false"}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12">
              <Label className="col-span-2">Created on</Label>
              <Label className="col-span-10">{getUITime(data.createdAt)}</Label>
            </div>
            <div className="grid grid-cols-12">
              <Label className="col-span-2">Last modified on</Label>
              <Label className="col-span-10">{getUITime(data.updatedAt)}</Label>
            </div>
            <Separator />
            <Label>
              You can define key, values below to allow for some key based flags
            </Label>
            <div className="grid grid-cols-12">
              <Label htmlFor="key" className="col-span-2">
                Key
              </Label>
              <Input
                id="key"
                placeholder="Enter a key"
                className="col-span-10"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-12">
              <Label htmlFor="values" className="col-span-2">
                Values
              </Label>
              <TagsInput
                id="values"
                className="col-span-10 bg-transparent"
                value={tags}
                onChange={(tags) => setTags(tags)}
              />
            </div>
            <div className="grid grid-cols-12 items-start">
              <Label htmlFor="values" className="col-span-2">
                Status
              </Label>
              <div className="grid grid-rows-2 col-span-10">
                <Switch
                  id="enabled"
                  checked={jsonValueEnabled}
                  className="col-span-10"
                  onCheckedChange={(checked) => setJsonValueEnabled(checked)}
                />
                <div className="text-muted-foreground text-sm">
                  Will return{" "}
                  <span className="italic">
                    {jsonValueEnabled ? "true" : "false"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="configuration">
          <div className="flex flex-col gap-2"></div>
        </TabsContent>
      </Tabs>
    </>
  );
}
