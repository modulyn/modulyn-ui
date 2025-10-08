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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEnvironments } from "@/core/hooks/use-environments";
import { useFeaturesOfProject } from "@/core/hooks/use-features-of-project";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<"features" | "targeting">(
    "features"
  );
  const { data: environments, isLoading: isLoadingEnvironments } =
    useEnvironments(selectedTab === "targeting", projectId);
  const { data: features, isLoading: isLoadingFeatures } = useFeaturesOfProject(
    selectedTab === "features",
    projectId
  );

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

  return (
    <div>
      <p className="scroll-m-20 text-sm font-semibold tracking-tight text-muted-foreground pb-2">
        Project
      </p>
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
              value="targeting"
              onClick={() => setSelectedTab("targeting")}
            >
              Targeting
            </TabsTrigger>
          </TabsList>
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
                <CardDescription>
                  Make changes to your account here. Click save when you&apos;re
                  done.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-name">Name</Label>
                  <Input id="tabs-demo-name" defaultValue="Pedro Duarte" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-username">Username</Label>
                  <Input id="tabs-demo-username" defaultValue="@peduarte" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="targeting">
            <Card>
              <CardHeader>
                <CardTitle>Targeting</CardTitle>
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
