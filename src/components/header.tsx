import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";

export function Header() {
  return (
    <div className="w-full flex items-center mt-1 justify-between border-b pb-2">
      <div className="flex gap-1 items-center">
        <SidebarTrigger />
        <span className="font-black text-foreground text-2xl">Modulyn</span>
      </div>
      <div>
        <ModeToggle />
      </div>
    </div>
  );
}
