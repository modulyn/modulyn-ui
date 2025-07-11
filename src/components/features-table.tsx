import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "./ui/badge";

export type Feature = {
  id: string;
  name: string;
  environments: string[];
};

export interface FeaturesTableProps {
  data: Feature[];
}

export function FeaturesTable({ data }: FeaturesTableProps) {
  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-medium">Feature</TableHead>
            <TableHead className="font-medium">Environments</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((feature) => (
            <TableRow key={feature.id}>
              <TableCell>{feature.name}</TableCell>
              <TableCell>
                <div className="flex flex-row gap-2">
                  {feature.environments.map((environnment) => (
                    <Badge key={environnment} variant="secondary">
                      {environnment}
                    </Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
