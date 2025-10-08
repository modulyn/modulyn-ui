import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { FeatureDetail } from "@/core/models/feature-detail";
import { Switch } from "@/components/ui/switch";

export interface FeatureDetailProps {
  data: FeatureDetail;
}

export function FeatureDetail(props: FeatureDetailProps) {
  const { data: feature } = props;
  return (
    <Card className="mb-2">
      <CardHeader>
        <CardTitle>{feature.name}</CardTitle>
        <CardDescription>
          Make changes to your feature here. Click save when you&apos;re done.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row gap-2">
        {feature.environments.map((env) => (
          <div key={env.id} className="flex items-center space-x-2">
            <Switch id={env.id} checked={env.enabled} />
            <Label htmlFor={env.id}>{env.name}</Label>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button>Save changes</Button>
      </CardFooter>
    </Card>
  );
}
