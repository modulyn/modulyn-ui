import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Link,
  useNavigate,
  useParams,
  useRouterState,
} from "@tanstack/react-router";
import { Command, PlusIcon } from "lucide-react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import { useEffect, useState } from "react";
import { projectsQueryOptions } from "@/services/projects";
import { environmentsQueryOptions } from "@/services/environments";
import { NewProject } from "./new-project";

export function AppSidebar() {
  const [openNewProject, setOpenNewProject] = useState(false);
  const navigate = useNavigate();
  const { projectId, environmentId, featureId } = useParams({
    strict: false,
  });
  const router = useRouterState();
  const [isProjectChanged, setIsProjectChanged] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>("");
  const { data: projects, isPending: isProjectsPending } = useSuspenseQuery(
    projectsQueryOptions()
  );
  const {
    data: environments,
    refetch: fetchEnvironments,
    isPending: isEnvironmentsPending,
  } = useQuery(environmentsQueryOptions(selectedProject));

  useEffect(() => {
    if (projects && projects.length > 0) {
      setSelectedProject(projects[0].id);
    }
  }, [projects]);

  useEffect(() => {
    if (environments && environments.length > 0) {
      if (isProjectChanged || router.location.pathname === "/") {
        setSelectedEnvironment(environments[0].id);
        setIsProjectChanged(false);
      }
    }
  }, [environments]);

  useEffect(() => {
    if (selectedProject) {
      fetchEnvironments();
    }
  }, [selectedProject]);

  useEffect(() => {
    if (
      selectedProject &&
      selectedEnvironment &&
      !isProjectsPending &&
      !isEnvironmentsPending &&
      !featureId
    ) {
      navigate({
        to: "/projects/$projectId/environments/$environmentId/features",
        params: {
          projectId: selectedProject,
          environmentId: selectedEnvironment,
        },
      });
    }
  }, [
    selectedProject,
    selectedEnvironment,
    isProjectsPending,
    isEnvironmentsPending,
    featureId,
  ]);

  useEffect(() => {
    if (environmentId) {
      setSelectedEnvironment(environmentId);
    }
  }, [environmentId]);

  useEffect(() => {
    if (projectId) {
      setSelectedProject(projectId);
    }
  }, [projectId]);

  const handleSelectProject = (projectId: string) => {
    setSelectedProject(projectId);
    setIsProjectChanged(true);
  };

  return (
    <Sidebar variant="floating" collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex flex-row">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-xl font-heading">
                    Modulyn
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupAction onClick={() => setOpenNewProject(true)}>
            <PlusIcon />
            <span className="sr-only">Add</span>
          </SidebarGroupAction>
          <SidebarMenu>
            {isProjectsPending && (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-6"></Skeleton>
                <Skeleton className="h-6"></Skeleton>
                <Skeleton className="h-6"></Skeleton>
                <Skeleton className="h-6"></Skeleton>
                <Skeleton className="h-6"></Skeleton>
              </div>
            )}
            {projects &&
              projects.length > 0 &&
              projects.map((project: any) => (
                <Collapsible
                  key={project.id}
                  className="group/collapsible"
                  open={selectedProject === project.id}
                  onOpenChange={() => handleSelectProject(project.id)}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={project.id === selectedProject}
                      onClick={() => handleSelectProject(project.id)}
                    >
                      <span>{project.name}</span>
                    </SidebarMenuButton>
                    <CollapsibleContent>
                      <SidebarGroup>
                        <SidebarGroupLabel>Environments</SidebarGroupLabel>
                        <SidebarMenuSub>
                          {isEnvironmentsPending && (
                            <div className="flex flex-col gap-2">
                              <Skeleton className="h-6"></Skeleton>
                              <Skeleton className="h-6"></Skeleton>
                              <Skeleton className="h-6"></Skeleton>
                              <Skeleton className="h-6"></Skeleton>
                              <Skeleton className="h-6"></Skeleton>
                            </div>
                          )}
                          {environments &&
                            environments.length > 0 &&
                            environments.map((environment: any) => (
                              <SidebarMenuSubItem key={environment.id}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={
                                    environment.id === selectedEnvironment
                                  }
                                  onClick={() =>
                                    setSelectedEnvironment(environment.id)
                                  }
                                >
                                  <Link
                                    to="/projects/$projectId/environments/$environmentId/features"
                                    params={{
                                      projectId: selectedProject,
                                      environmentId: environment.id,
                                    }}
                                  >
                                    <span>{environment.name}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                      </SidebarGroup>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      {openNewProject && (
        <NewProject
          open={openNewProject}
          onOpenChange={() => setOpenNewProject(!openNewProject)}
        />
      )}
    </Sidebar>
  );
}
