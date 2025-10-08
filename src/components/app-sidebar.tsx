import { ChevronUp, Plus, User2 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProjects } from "@/core/hooks/use-projects";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCreateProject } from "@/core/hooks/use-create-project";
import { NewProjectDialog } from "./new-project-dialog";
import { toast } from "sonner";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    data: projects,
    isLoading,
    isError: isProjectsError,
    error: projectsError,
  } = useProjects();
  const [createProjectDialogOpen, setCreateProjectDialogOpen] = useState(false);
  const {
    mutate: createProject,
    isError: isCreateProjectError,
    error: createProjectError,
  } = useCreateProject();

  const projectIdFromUrl = location.pathname.split("/")[2];

  useEffect(() => {
    if (!isLoading && projects && projects.length > 0 && !projectIdFromUrl) {
      navigate(`/projects/${projects[0].id}`);
    }
  }, [projects, isLoading, projectIdFromUrl, navigate]);

  const handleCreateProject = (projectName: string) => {
    if (!projectName.trim()) return;
    console.log("Creating project:", projectName);
    createProject(projectName);

    // After creation, close the dialog and reset the form
    setCreateProjectDialogOpen(false);
  };

  useEffect(() => {
    if (isProjectsError) {
      console.error(projectsError);
      toast.error("Error loading projects");
    }
  }, [isProjectsError]);

  useEffect(() => {
    if (isCreateProjectError) {
      console.error(createProjectError);
      toast.error("Error creating project");
    }
  }, [isCreateProjectError]);

  return (
    <>
      <Sidebar variant="floating">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupAction title="Add Project">
              <Plus onClick={() => setCreateProjectDialogOpen(true)} />{" "}
              <span className="sr-only">Add Project</span>
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                {isLoading ? (
                  <>
                    <SidebarMenuItem>
                      <Skeleton className="w-full h-6" />
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Skeleton className="w-full h-6" />
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Skeleton className="w-full h-6" />
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Skeleton className="w-full h-6" />
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Skeleton className="w-full h-6" />
                    </SidebarMenuItem>
                  </>
                ) : (
                  projects?.map((d: any) => (
                    <SidebarMenuItem
                      key={d.id}
                      onClick={() => navigate(`/projects/${d.id}`)}
                    >
                      <SidebarMenuButton
                        asChild
                        isActive={d.id === projectIdFromUrl}
                      >
                        <div>{d.name}</div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> Username
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <NewProjectDialog
        open={createProjectDialogOpen}
        setOpen={setCreateProjectDialogOpen}
        handleCreate={handleCreateProject}
      />
    </>
  );
}
