import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Toaster } from "@/components/ui/sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ShieldUserIcon } from "lucide-react";
import LogoutButton from "@/components/logout-button";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "@/components/login-button";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth0();
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex justify-between sticky top-0 z-10 bg-background pt-2 pr-2">
          <SidebarTrigger />
          <div className="flex flex-row gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ShieldUserIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-32">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  {isAuthenticated ? <LogoutButton /> : <LoginButton />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ModeToggle />
          </div>
        </div>
        <div className="flex flex-col pb-2 pl-2 pr-4 gap-2">{children}</div>
        <Toaster />
      </main>
    </SidebarProvider>
  );
}
