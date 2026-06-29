import { FolderKanban } from "lucide-react";
import { ResourceManager, ResourceRecord } from "@/components/admin/ResourceManager";
import {
  Project,
  createProject,
  deleteProject,
  getAdminProjects,
  updateProject
} from "@/api/projects";

const today = () => new Date().toISOString().slice(0, 10);

type ProjectFormRecord = ResourceRecord & { image?: string };

function toForm(item: ResourceRecord): ProjectFormRecord {
  const images = Array.isArray(item.images) ? item.images : [];
  return { ...item, image: String(images[0] || "") };
}

function toPayload(form: ResourceRecord): ResourceRecord {
  const { image, ...rest } = form as ProjectFormRecord;
  return {
    ...rest,
    images: image ? [String(image)] : []
  };
}

export function AdminProjects() {
  return (
    <ResourceManager
      title="Project"
      description="Create and manage case-study style project records displayed on the public Projects page."
      icon={<FolderKanban className="h-5 w-5" />}
      actionLabel="New Project"
      listTitle="Projects"
      listDescription="Project data loaded from /api/admin/projects. Public pages can read published projects without an access token."
      defaultValues={{
        _id: "new",
        title: "",
        description: "",
        industry: "Technology",
        technologies: [],
        images: [],
        image: "",
        client: "",
        testimonial: "",
        completedDate: today(),
        challenge: "",
        solution: "",
        status: "Draft"
      }}
      fields={[
        { key: "title", label: "Project Title", kind: "text", placeholder: "e.g. AI Customer Support Platform" },
        { key: "client", label: "Client", kind: "text", placeholder: "e.g. NovaTech Ltd." },
        { key: "completedDate", label: "Completed Date", kind: "date" },
        { key: "description", label: "Description", kind: "textarea", rows: 6, placeholder: "Short project summary for the card..." },
        { key: "challenge", label: "Challenge", kind: "textarea", rows: 5, zone: "details", placeholder: "Describe the client problem..." },
        { key: "solution", label: "Solution", kind: "textarea", rows: 5, zone: "details", placeholder: "Describe what was built..." },
        { key: "testimonial", label: "Client Testimonial", kind: "textarea", rows: 4, zone: "details", placeholder: "Optional testimonial..." },
        { key: "technologies", label: "Technologies", kind: "array", zone: "details", placeholder: "React, Node.js, SQLite" },
        { key: "industry", label: "Industry", kind: "select", zone: "side", options: ["Technology", "Healthcare", "Education", "Finance", "Retail", "Manufacturing", "E-commerce"] },
        { key: "image", label: "Project Image", kind: "image", zone: "side" }
      ]}
      loadItems={async () => (await getAdminProjects()).projects as unknown as ResourceRecord[]}
      createItem={(data) => createProject(data as unknown as Omit<Project, "_id" | "isMock">)}
      updateItem={(id, data) => updateProject(id, data as unknown as Partial<Project>)}
      deleteItem={deleteProject}
      listDetails={(item) => [String(item.client || ""), String(item.industry || ""), String(item.completedDate || ""), `${Array.isArray(item.technologies) ? item.technologies.length : 0} technologies`]}
      transformToForm={toForm}
      transformToPayload={toPayload}
    />
  );
}
