import { useEnvironments } from "@/core/hooks/use-environments";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { data: environments, isLoading } = useEnvironments(projectId);

  useEffect(() => {
    if (!isLoading && !environments) {
      navigate("/");
    }
  }, [isLoading, environments, navigate]);

  return <div>Project Page: {projectId}</div>;
}
