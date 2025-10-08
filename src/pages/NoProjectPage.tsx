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
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function NoProjectPage() {
  const [open, setOpen] = useState(false);
  const {
    mutate: createProject,
    isError: isCreateProjectError,
    error: createProjectError,
  } = useCreateProject();

  const handleCreate = (projectName: string) => {
    if (!projectName.trim()) return;
    createProject(projectName);

    // After creation, close the dialog and reset the form
    setOpen(false);
  };

  useEffect(() => {
    if (isCreateProjectError) {
      console.error(createProjectError);
      toast.error("Error creating project");
    }
  }, [isCreateProjectError]);

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
