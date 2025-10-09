import { FeatureDetail } from "@/components/feature-detail";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEnvironments } from "@/core/hooks/use-environments";
import { useFeaturesOfProject } from "@/core/hooks/use-features-of-project";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<"features" | "targetings">(
    "features"
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data: environments, isLoading: isLoadingEnvironments } =
    useEnvironments(selectedTab === "targetings", projectId);
  const {
    data: features,
    isLoading: isLoadingFeatures,
    refetch: fetchFeatures,
  } = useFeaturesOfProject(selectedTab === "features", searchTerm, projectId);

  useEffect(() => {
    if (
      !isLoadingFeatures &&
      !isLoadingEnvironments &&
      !features &&
      !environments
    ) {
      navigate("/");
    }
  }, [
    isLoadingEnvironments,
    isLoadingFeatures,
    environments,
    features,
    navigate,
  ]);

  useEffect(() => {
    if (searchTerm === "") {
      fetchFeatures();
    } else if (searchTerm.length > 2) {
      fetchFeatures();
    }
  }, [searchTerm, fetchFeatures]);

  return (
    <div>
      <div className="flex flex-row w-full justify-between items-center">
        <p className="scroll-m-20 text-sm font-semibold tracking-tight text-muted-foreground pb-2 flex-4">
          Project
        </p>
        <Input
          className="flex-1"
          placeholder={`Search ${selectedTab}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div>
        <h3 className="scroll-m-20 pb-4 text-2xl font-semibold tracking-tight first:mt-0">
          {projectId}
        </h3>
      </div>
      <div className="flex w-full flex-col">
        <Tabs defaultValue="features">
          <TabsList>
            <TabsTrigger
              value="features"
              onClick={() => setSelectedTab("features")}
            >
              Features
            </TabsTrigger>
            <TabsTrigger
              value="targetings"
              onClick={() => setSelectedTab("targetings")}
            >
              Targetings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="features">
            {isLoadingFeatures && (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            )}
            {features?.map((feature) => (
              <FeatureDetail key={feature.id} data={feature} />
            ))}
          </TabsContent>
          <TabsContent value="targetings">
            <Card>
              <CardHeader>
                <CardTitle>Targetings</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you&apos;ll be logged
                  out.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-current">Current password</Label>
                  <Input id="tabs-demo-current" type="password" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-new">New password</Label>
                  <Input id="tabs-demo-new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
