import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export interface NewProjectDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleCreate: (projectName: string) => void;
}

export function NewProjectDialog(props: NewProjectDialogProps) {
  const { open, setOpen, handleCreate } = props;
  const [projectName, setProjectName] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Create a New Project</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate(projectName);
            setProjectName("");
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="project-name" className="mb-2 block">
              Project Name
            </Label>
            <Input
              id="project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter your project name"
              required
              className="focus:ring-2 focus:ring-primary"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={!projectName.trim()}
              className="w-full"
            >
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
