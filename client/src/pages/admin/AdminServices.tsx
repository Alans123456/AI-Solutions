import { Code2 } from "lucide-react";
import { ResourceManager, ResourceRecord } from "@/components/admin/ResourceManager";
import {
  Service,
  createService,
  deleteService,
  getAdminServices,
  updateService
} from "@/api/services";

export function AdminServices() {
  return (
    <ResourceManager
      title="Service"
      description="Create and manage promotional service cards displayed on the public Services page."
      icon={<Code2 className="h-5 w-5" />}
      actionLabel="New Service"
      listTitle="Services"
      listDescription="Service data loaded from /api/admin/services. Public pages can read services without an access token."
      defaultValues={{
        _id: "new",
        title: "",
        description: "",
        icon: "Globe",
        category: "Development",
        technologies: [],
        features: [],
        pricing: "Starting from $1,000",
        status: "Draft"
      }}
      fields={[
        { key: "title", label: "Service Title", kind: "text", placeholder: "e.g. AI Automation" },
        { key: "description", label: "Description", kind: "textarea", rows: 7, placeholder: "Explain the service clearly for visitors..." },
        { key: "technologies", label: "Technologies", kind: "array", zone: "details", placeholder: "React, Node.js, Gemini" },
        { key: "features", label: "Features", kind: "array", zone: "details", placeholder: "Admin panel, API integration, Deployment" },
        { key: "icon", label: "Icon", kind: "select", zone: "side", options: ["Globe", "Smartphone", "Cloud", "Brain"] },
        { key: "category", label: "Category", kind: "select", zone: "side", options: ["Development", "Artificial Intelligence", "Infrastructure", "Consulting", "Mobile"] },
        { key: "pricing", label: "Pricing", kind: "text", zone: "side", placeholder: "Starting from $1,000" }
      ]}
      loadItems={async () => (await getAdminServices()).services as unknown as ResourceRecord[]}
      createItem={(data) => createService(data as unknown as Omit<Service, "_id" | "isMock">)}
      updateItem={(id, data) => updateService(id, data as unknown as Partial<Service>)}
      deleteItem={deleteService}
      listDetails={(item) => [String(item.category || ""), String(item.pricing || ""), `${Array.isArray(item.technologies) ? item.technologies.length : 0} technologies`]}
    />
  );
}
