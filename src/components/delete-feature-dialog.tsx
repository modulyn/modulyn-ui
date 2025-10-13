import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { TrashIcon } from "lucide-react";
import { Label } from "./ui/label";
import { useState } from "react";

interface DeleteFeatureDialogProps {
  onDelete: () => void;
  featureLabel: string;
}

export function DeleteFeatureDialog(props: DeleteFeatureDialogProps) {
  const { onDelete, featureLabel } = props;
  const [typedFeatureLabel, setTypedFeatureLabel] = useState<string>();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="cursor-pointer">
          <TrashIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-80">
        <DialogHeader>
          <DialogTitle>Delete Feature</DialogTitle>
          <DialogDescription>
            Type the name of the feature to delete
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Label htmlFor="feature-name">Feature name</Label>
          <Input
            id="feature-name"
            type="text"
            onChange={(e) => setTypedFeatureLabel(e.target.value)}
            value={typedFeatureLabel}
          />
        </div>
        <Button
          disabled={typedFeatureLabel !== featureLabel}
          onClick={onDelete}
        >
          <TrashIcon /> Delete
        </Button>
      </DialogContent>
    </Dialog>
  );
}
