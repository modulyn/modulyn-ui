import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { getUITime } from "@/lib/utils";

type FeatureCardProps = {
  id: string;
  name: string;
  enabled: boolean;
  updatedAt: string;
  onFeatureClick: (featureId: string) => void;
};

export function FeatureCard({
  id,
  enabled,
  name,
  updatedAt,
  onFeatureClick,
}: FeatureCardProps) {
  return (
    <Card onClick={() => onFeatureClick(id)}>
      <CardContent>
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <span key={id}>{name}</span>
            <Switch checked={enabled} disabled />
          </div>
          <div className="text-muted-foreground text-xs">
            Modified on: {getUITime(updatedAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
