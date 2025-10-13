import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { Label } from "./ui/label";
import { useState } from "react";
import { Textarea } from "./ui/textarea";

interface AddFeatureDialogProps {
  onAdd: (name: string, description?: string) => void;
}

export function AddFeatureDialog(props: AddFeatureDialogProps) {
  const { onAdd } = props;
  const [open, setOpen] = useState(false);
  const [featureName, setFeatureName] = useState<string>("");
  const [featureDescription, setFeatureDescription] = useState<string>("");

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <Button>
          <PlusIcon />
          <p>Feature</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-80">
        <DialogHeader>
          <DialogTitle>New Feature</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <Label htmlFor="feature-name">Name</Label>
          <Input
            id="feature-name"
            type="text"
            required
            onChange={(e) => setFeatureName(e.target.value)}
            value={featureName}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="feature-description">Description</Label>
          <Textarea
            id="feature-description"
            onChange={(e) => setFeatureDescription(e.target.value)}
            value={featureDescription}
          />
        </div>
        <Button
          type="submit"
          onClick={() => {
            onAdd(featureName, featureDescription);
            setFeatureName("");
            setFeatureDescription("");
            setOpen(false);
          }}
        >
          Add
        </Button>
      </DialogContent>
    </Dialog>
  );
}
