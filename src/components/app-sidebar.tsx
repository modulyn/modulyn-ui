import { ChevronUp, User2 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
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
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isLoading } = useProjects();

  const projectIdFromUrl = location.pathname.split("/")[2];

  useEffect(() => {
    if (!isLoading && data && data.length > 0 && !projectIdFromUrl) {
      navigate(`/projects/${data[0].id}`);
    }
  }, [data, isLoading, projectIdFromUrl, navigate]);

  return (
    <Sidebar variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
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
                data?.map((d: any) => (
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
  );
}
