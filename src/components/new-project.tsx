import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { projectCreateMutation } from "@/services/projects";
import { useState } from "react";

type NewProjectProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function NewProject({ open, onOpenChange }: NewProjectProps) {
  const { mutate: createProject } = projectCreateMutation();
  const [name, setName] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleCreateProject = () => {
    if (name) {
      createProject({
        name: name,
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add project</SheetTitle>
          <SheetDescription>
            Creating a new project also adds an environment named "Default"
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-0 px-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              required
              value={name}
              onChange={handleNameChange}
              className="col-span-3"
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={handleCreateProject}>Create</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
