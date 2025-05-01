import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { isPending, data, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8080/api/v1/projects");
      return await response.json();
    },
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="flex flex-col py-2 px-2">
      <div className="text-2xl">Projects</div>
      <div className="grid grid-cols-4 gap-2 mt-2">
        {data.data.map((project: any) => (
          <Card>
            <CardContent>
              <div>
                Name: <span key={project.id}>{project.name}</span>
              </div>
              <div>
                Name: <span key={project.id}>{project.name}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
