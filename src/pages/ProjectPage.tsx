import { useParams } from "react-router";

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  return <div>Project Page: {projectId}</div>;
}
