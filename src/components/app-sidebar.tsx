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
  const { projectId, environmentId } = useParams({
    strict: false,
  });
  const router = useRouterState();
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>("");
  const { data: projects, isPending: isProjectsPending } = useSuspenseQuery(
    projectsQueryOptions()
  );
  const {
    data: environments,
    isPending: isEnvironmentsPending,
    refetch: fetchEnvironments,
  } = useQuery(environmentsQueryOptions(selectedProject));

  useEffect(() => {
    if (router.location.pathname === "/") {
      setSelectedProject(projects[0].id);
    }
  }, [router.location.pathname]);

  useEffect(() => {
    if (selectedProject) {
      fetchEnvironments();
    }
  }, [selectedProject]);

  useEffect(() => {
    if (
      !projectId &&
      !environmentId &&
      projects &&
      projects.length > 0 &&
      environments &&
      environments.length > 0
    ) {
      setSelectedProject(projects[0].id);
      setSelectedEnvironment(environments[0].id);
      navigate({
        to: "/projects/$projectId/environments/$environmentId/features",
        params: {
          projectId: projects[0].id,
          environmentId: environments[0].id,
        },
      });
    }
  }, [projectId, environmentId, projects, environments]);

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

  const handleSelectSidebarItem = (
    newProjectId: string,
    newEnvironmentId?: string
  ) => {
    let envToRedirectTo = "";
    if (!newEnvironmentId) {
      envToRedirectTo = `sdk-${newProjectId}`;
    } else {
      envToRedirectTo = newEnvironmentId;
    }
    setSelectedProject(newProjectId);
    setSelectedEnvironment(envToRedirectTo);
    navigate({
      to: "/projects/$projectId/environments/$environmentId/features",
      params: {
        projectId: newProjectId,
        environmentId: envToRedirectTo,
      },
    });
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
              projects.map((project) => (
                <Collapsible
                  key={project.id}
                  className="group/collapsible"
                  open={selectedProject === project.id}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={project.id === selectedProject}
                      onClick={() => handleSelectSidebarItem(project.id)}
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
                            environments.map((environment) => (
                              <SidebarMenuSubItem key={environment.id}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={
                                    environment.id === selectedEnvironment
                                  }
                                  onClick={() =>
                                    handleSelectSidebarItem(
                                      project.id,
                                      environment.id
                                    )
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
