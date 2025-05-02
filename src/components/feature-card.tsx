import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

type FeatureCardProps = {
  id: string;
  name: string;
  enabled: boolean;
  updatedAt: string;
};

export function FeatureCard({
  id,
  enabled,
  name,
  updatedAt,
}: FeatureCardProps) {
  var options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour12: true,
  };
  const updateTime = new Date(updatedAt).toLocaleTimeString([], options);
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <span key={id}>{name}</span>
            <Switch checked={enabled} />
          </div>
          <div className="text-muted-foreground text-xs">
            Modified on: {updateTime}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
