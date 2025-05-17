import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TagsInput } from "@/components/ui/tags-input";
import { getUITime } from "@/lib/utils";
import {
  featureQueryOptions,
  featureUpdateMutation,
} from "@/services/features";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, SaveIcon } from "lucide-react";
import { AnyFieldApi, useForm } from "@tanstack/react-form";

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
  const updateFeatureMutation = featureUpdateMutation(
    projectId,
    environmentId,
    featureId
  );

  const { handleSubmit, Field, Subscribe } = useForm({
    defaultValues: {
      enabled: data?.enabled ?? false,
      jsonValue: data?.jsonValue ?? {
        key: "",
        values: [],
        enabled: false,
      },
    },
    onSubmit: async ({ value }) => {
      await updateFeatureMutation.mutateAsync(value);
    },
  });

  function FieldInfo({ field }: { field: AnyFieldApi }) {
    return (
      <>
        {field.state.meta.isTouched && !field.state.meta.isValid ? (
          <em className="text-xs text-red-500">
            {field.state.meta.errors.join(",")}
          </em>
        ) : null}
        {field.state.meta.isValidating ? "Validating..." : null}
      </>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit();
      }}
    >
      <div className="flex flex-row justify-between gap-2 my-2">
        <div className="text-2xl">{data.name}</div>
        <div className="flex flex-row gap-2">
          <Subscribe
            selector={(state) => [state.canSubmit, state.isDefaultValue]}
            children={([canSubmit, isDefaultValue]) => (
              <Button disabled={isDefaultValue || !canSubmit} type="submit">
                <SaveIcon /> Save
              </Button>
            )}
          />
        </div>
      </div>
      <Tabs defaultValue="status">
        <TabsList className="w-full">
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>
        <TabsContent value="status">
          <div className="flex flex-col gap-4 mt-4">
            <Field
              name="enabled"
              children={(field) => {
                return (
                  <div className="grid grid-cols-12 items-start">
                    <Label htmlFor={field.name} className="col-span-2">
                      Default value
                    </Label>
                    <div className="grid grid-rows-2 col-span-10">
                      <Switch
                        id={field.name}
                        name={field.name}
                        checked={field.state.value}
                        className="col-span-10"
                        onCheckedChange={(checked) =>
                          field.handleChange(checked)
                        }
                      />
                      <div className="text-muted-foreground text-sm">
                        Will return{" "}
                        <span className="italic">
                          {field.state.value ? "true" : "false"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            ></Field>
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
            <Field
              name="jsonValue.key"
              validators={{
                onChange: ({ value }) =>
                  !value
                    ? "Key is required"
                    : value.length < 3
                      ? "Key must be atleast 3 characters"
                      : undefined,
                onChangeAsyncDebounceMs: 500,
              }}
              children={(field) => {
                return (
                  <>
                    <div className="grid grid-cols-12">
                      <Label htmlFor={field.name} className="col-span-2">
                        Key
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="Enter a key"
                        className="col-span-10"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                    <FieldInfo field={field} />
                  </>
                );
              }}
            ></Field>
            <Field
              name="jsonValue.values"
              children={(field) => {
                return (
                  <div className="grid grid-cols-12">
                    <Label htmlFor={field.name} className="col-span-2">
                      Values
                    </Label>
                    <TagsInput
                      id={field.name}
                      name={field.name}
                      className="col-span-10 bg-transparent"
                      value={
                        field.state.value?.map((v) => {
                          return {
                            id: v,
                            name: v,
                          };
                        }) ?? []
                      }
                      onChange={(tags) =>
                        field.handleChange(tags.map((tag) => tag.name))
                      }
                    />
                  </div>
                );
              }}
            ></Field>
            <Field
              name="jsonValue.enabled"
              children={(field) => {
                return (
                  <div className="grid grid-cols-12 items-start">
                    <Label htmlFor={field.name} className="col-span-2">
                      Status
                    </Label>
                    <div className="grid grid-rows-2 col-span-10">
                      <Switch
                        id={field.name}
                        name={field.name}
                        checked={field.state.value}
                        className="col-span-10"
                        onCheckedChange={(checked) =>
                          field.handleChange(checked)
                        }
                      />
                      <div className="text-muted-foreground text-sm">
                        Will return{" "}
                        <span className="italic">
                          {field.state.value ? "true" : "false"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            ></Field>
          </div>
        </TabsContent>
        <TabsContent value="configuration">
          <div className="flex flex-col gap-2"></div>
        </TabsContent>
      </Tabs>
    </form>
  );
}
