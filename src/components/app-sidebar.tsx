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
import { Link, useNavigate } from "@tanstack/react-router";
import { Command, PlusIcon } from "lucide-react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import { useEffect, useState } from "react";
import { projectsQueryOptions } from "@/services/projects";
import { environmentsQueryOptions } from "@/services/environments";

export function AppSidebar() {
  const navigate = useNavigate();
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
      setSelectedEnvironment(environments[0].id);
    }
  }, [environments]);

  useEffect(() => {
    if (selectedProject) {
      fetchEnvironments();
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedEnvironment) {
      navigate({
        to: "/environments/$environmentId/features",
        params: { environmentId: selectedEnvironment },
      });
    }
  }, [selectedEnvironment]);

  return (
    <Sidebar variant="floating" collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-xl font-heading">
                    Modulyn
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupAction>
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
                  onOpenChange={() => setSelectedProject(project.id)}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={project.id === selectedProject}
                      onClick={() => setSelectedProject(project.id)}
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
                                  <span>{environment.name}</span>
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
    </Sidebar>
  );
}
