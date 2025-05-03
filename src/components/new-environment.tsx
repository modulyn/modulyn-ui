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
import { useParams } from "@tanstack/react-router";
import { environmentCreateMutation } from "@/services/environments";
import { useState } from "react";

type NewEnvironmentProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function NewEnvironment({ open, onOpenChange }: NewEnvironmentProps) {
  const { projectId } = useParams({
    from: "/projects/$projectId/environments/$environmentId/features/",
  });
  const { mutate: createEnvironment } = environmentCreateMutation(projectId);
  const [name, setName] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleCreateEnvironment = () => {
    if (name) {
      createEnvironment({
        name: name,
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add environment</SheetTitle>
          <SheetDescription>
            Creating a new environment will generate a SDK Key for this
            environment
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
            <Button onClick={handleCreateEnvironment}>Create</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
