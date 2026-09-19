import { projects } from "@/lib/data";
import { ProjectList } from "@/components/ui/ProjectList";

export default function HomePage() {
  return <ProjectList projects={projects} />;
}
