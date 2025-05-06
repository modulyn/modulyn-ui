import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex justify-between sticky top-0 z-10 bg-background pt-2 pr-2">
          <SidebarTrigger />
          <ModeToggle />
        </div>
        <div className="flex flex-col pb-2 pl-2 pr-4 gap-2">{children}</div>
        <Toaster />
      </main>
    </SidebarProvider>
  );
}
