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
import { featureCreateMutation } from "@/services/features";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";

type NewFeatureProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function NewFeature({ open, onOpenChange }: NewFeatureProps) {
  const { projectId, environmentId } = useParams({
    from: "/projects/$projectId/environments/$environmentId/features/",
  });
  const { mutate: createFeature } = featureCreateMutation(
    projectId,
    environmentId
  );
  const [name, setName] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleCreateFeature = () => {
    if (name) {
      createFeature({
        name: name,
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add feature</SheetTitle>
          <SheetDescription>Creating a new feature</SheetDescription>
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
            <Button onClick={handleCreateFeature}>Create</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
