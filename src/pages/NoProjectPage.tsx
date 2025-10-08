import { NewProjectDialog } from "@/components/new-project-dialog";
import { Button } from "@/components/ui/button";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useCreateProject } from "@/core/hooks/use-create-project";
import { IconFolderCode } from "@tabler/icons-react";
import { useState } from "react";

export default function NoProjectPage() {
  const [open, setOpen] = useState(false);
  const { mutate: createProject } = useCreateProject();

  const handleCreate = (projectName: string) => {
    if (!projectName.trim()) return;
    console.log("Creating project:", projectName);
    createProject(projectName);

    // After creation, close the dialog and reset the form
    setOpen(false);
  };

  return (
    <>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconFolderCode />
          </EmptyMedia>
          <EmptyTitle>No Projects Yet</EmptyTitle>
          <EmptyDescription>
            You haven't created any projects yet. Get started by creating your
            first project.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button onClick={() => setOpen(true)}>Create Project</Button>
          </div>
        </EmptyContent>
      </Empty>
      <NewProjectDialog
        open={open}
        setOpen={setOpen}
        handleCreate={handleCreate}
      />
    </>
  );
}
