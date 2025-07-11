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
} from "@/components/ui/sidebar";
import { useNavigate, useParams, useRouterState } from "@tanstack/react-router";
import { Command, PlusIcon } from "lucide-react";
import { Collapsible } from "@/components/ui/collapsible";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import { useEffect, useState } from "react";
import { projectsQueryOptions } from "@/services/projects";
import { NewProject } from "./new-project";

export function AppSidebar() {
  const navigate = useNavigate();
  const [openNewProject, setOpenNewProject] = useState(false);
  const { projectId } = useParams({
    strict: false,
  });
  const router = useRouterState();
  const [selectedProject, setSelectedProject] = useState<string>("");
  const { data: projects, isPending: isProjectsPending } = useSuspenseQuery(
    projectsQueryOptions()
  );

  useEffect(() => {
    if (router.location.pathname === "/") {
      setSelectedProject(projects[0]?.id);
    }
  }, [router.location.pathname]);

  useEffect(() => {
    if (!projectId && projects && projects.length > 0) {
      setSelectedProject(projects[0].id);
    }
  }, [projectId, projects]);

  useEffect(() => {
    if (projectId) {
      setSelectedProject(projectId);
    }
  }, [projectId]);

  const handleSelectSidebarItem = (newProjectId: string) => {
    setSelectedProject(newProjectId);
  };

  useEffect(() => {
    if (selectedProject) {
      navigate({
        to: "/projects/$projectId",
        params: {
          projectId: selectedProject,
        },
      });
    }
  }, [selectedProject]);

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
