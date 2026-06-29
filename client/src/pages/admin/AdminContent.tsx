import { BriefcaseBusiness, Calendar, FileQuestion, FileText, Image, UserRound, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourceManager, ResourceRecord } from "@/components/admin/ResourceManager";
import {
  BlogPost,
  createBlogPost,
  deleteBlogPost,
  getAdminBlogPosts,
  updateBlogPost
} from "@/api/blog";
import {
  Event,
  createEvent,
  deleteEvent,
  getAdminEvents,
  updateEvent
} from "@/api/events";
import {
  GalleryImage,
  createGalleryImage,
  deleteGalleryImage,
  getAdminGalleryImages,
  updateGalleryImage
} from "@/api/gallery";
import {
  Testimonial,
  createTestimonial,
  deleteTestimonial,
  getAdminTestimonials,
  updateTestimonial
} from "@/api/testimonials";
import {
  Faq,
  TeamMember,
  createFaq,
  createTeamMember,
  deleteFaq,
  deleteTeamMember,
  getAdminFaqs,
  getAdminTeamMembers,
  updateFaq,
  updateTeamMember
} from "@/api/about";
import {
  Career,
  createCareer,
  deleteCareer,
  getAdminCareers,
  updateCareer
} from "@/api/careers";

const today = () => new Date().toISOString().slice(0, 10);

export function AdminContent() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Content Management</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Manage promotional blog posts, events, careers, testimonials, gallery, team, and FAQ records from SQLite.
        </p>
      </div>

      <Tabs defaultValue="blog" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-white/70 p-1 backdrop-blur dark:bg-slate-950/60 md:grid-cols-7">
          <TabsTrigger value="blog" className="rounded-xl"><FileText className="mr-2 h-4 w-4" />Blog</TabsTrigger>
          <TabsTrigger value="events" className="rounded-xl"><Calendar className="mr-2 h-4 w-4" />Events</TabsTrigger>
          <TabsTrigger value="careers" className="rounded-xl"><BriefcaseBusiness className="mr-2 h-4 w-4" />Careers</TabsTrigger>
          <TabsTrigger value="testimonials" className="rounded-xl"><Users className="mr-2 h-4 w-4" />Testimonials</TabsTrigger>
          <TabsTrigger value="gallery" className="rounded-xl"><Image className="mr-2 h-4 w-4" />Gallery</TabsTrigger>
          <TabsTrigger value="team" className="rounded-xl"><UserRound className="mr-2 h-4 w-4" />Team</TabsTrigger>
          <TabsTrigger value="faqs" className="rounded-xl"><FileQuestion className="mr-2 h-4 w-4" />FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="blog">
          <ResourceManager
            title="Blog Post"
            description="Fill in the content below to publish a company article or promotional blog post."
            icon={<FileText className="h-5 w-5" />}
            actionLabel="New Post"
            listTitle="Blog Posts"
            listDescription="Blog and article data loaded from /api/admin/blog."
            defaultValues={{
              _id: "new",
              title: "",
              excerpt: "",
              content: "",
              author: "Admin",
              publishDate: today(),
              readTime: 5,
              category: "Technology",
              tags: [],
              featuredImage: "",
              featured: false,
              status: "Draft",
              views: 0
            }}
            fields={[
              { key: "title", label: "Post Title", kind: "text", placeholder: "e.g. How AI Automation Improves Business Productivity" },
              { key: "author", label: "Author", kind: "text", placeholder: "Admin" },
              { key: "publishDate", label: "Publish Date", kind: "date" },
              { key: "excerpt", label: "Excerpt", kind: "textarea", rows: 4, placeholder: "Write a short summary shown on the blog card..." },
              { key: "content", label: "Full Content", kind: "textarea", rows: 10, placeholder: "Write the complete article content here..." },
              { key: "tags", label: "Tags", kind: "array", zone: "details", placeholder: "AI, Automation, Business" },
              { key: "featured", label: "Mark this post as featured", kind: "checkbox", zone: "details" },
              { key: "category", label: "Category", kind: "select", zone: "side", options: ["Technology", "AI", "Business", "Product", "Industry", "Case Study"] },
              { key: "readTime", label: "Read Time", kind: "number", zone: "side" },
              { key: "featuredImage", label: "Featured Image", kind: "image", zone: "side" }
            ]}
            loadItems={async () => (await getAdminBlogPosts()).posts as unknown as ResourceRecord[]}
            createItem={(data) => createBlogPost(data as unknown as Omit<BlogPost, "_id" | "isMock">)}
            updateItem={(id, data) => updateBlogPost(id, data as unknown as Partial<BlogPost>)}
            deleteItem={deleteBlogPost}
            listDetails={(item) => [`By ${String(item.author || "Admin")}`, String(item.publishDate || ""), `${String(item.views || 0)} views`, String(item.category || "")]}
          />
        </TabsContent>

        <TabsContent value="events">
          <ResourceManager
            title="Event"
            description="Fill in the details below to schedule a new corporate or community event."
            icon={<Calendar className="h-5 w-5" />}
            actionLabel="New Event"
            listTitle="Events"
            listDescription="Event data loaded from /api/admin/events."
            defaultValues={{
              _id: "new",
              title: "",
              description: "",
              date: today(),
              time: "10:00",
              type: "Workshop",
              locationType: "Physical",
              location: "",
              speakers: [],
              agenda: [],
              registrationRequired: true,
              maxAttendees: 50,
              currentAttendees: 0,
              image: "",
              status: "Draft"
            }}
            fields={[
              { key: "title", label: "Event Title", kind: "text", placeholder: "e.g. Q4 Tech Innovation Summit" },
              { key: "date", label: "Event Date", kind: "date" },
              { key: "time", label: "Event Time", kind: "time" },
              { key: "description", label: "Description", kind: "textarea", rows: 6, placeholder: "Provide a detailed overview of the event objectives and agenda..." },
              { key: "locationType", label: "Location Type", kind: "select", zone: "details", options: ["Physical", "Virtual"] },
              { key: "location", label: "Venue / Meeting Link", kind: "text", zone: "details", placeholder: "Enter address or URL" },
              { key: "speakers", label: "Speakers", kind: "array", zone: "details", placeholder: "Jane Doe, Sarah Smith" },
              { key: "agenda", label: "Agenda", kind: "array", zone: "details", placeholder: "Opening, Demo, Networking" },
              { key: "registrationRequired", label: "Registration required", kind: "checkbox", zone: "details" },
              { key: "maxAttendees", label: "Max Attendees", kind: "number", zone: "details" },
              { key: "currentAttendees", label: "Current Attendees", kind: "number", zone: "details" },
              { key: "type", label: "Event Category", kind: "select", zone: "side", options: ["Workshop", "Seminar", "Meetup", "Conference", "Webinar", "Product Launch"] },
              { key: "image", label: "Cover Image", kind: "image", zone: "side" }
            ]}
            loadItems={async () => (await getAdminEvents()).events as unknown as ResourceRecord[]}
            createItem={(data) => createEvent(data as unknown as Omit<Event, "_id" | "isMock">)}
            updateItem={(id, data) => updateEvent(id, data as unknown as Partial<Event>)}
            deleteItem={deleteEvent}
            listDetails={(item) => [String(item.date || ""), String(item.time || ""), `${String(item.currentAttendees || 0)} attendees`, String(item.type || "")]}
          />
        </TabsContent>

        <TabsContent value="careers">
          <ResourceManager
            title="Vacancy"
            description="Create and publish open roles for the public Careers page."
            icon={<BriefcaseBusiness className="h-5 w-5" />}
            actionLabel="New Vacancy"
            listTitle="Career Vacancies"
            listDescription="Career vacancy data loaded from /api/admin/careers."
            defaultValues={{
              _id: "new",
              title: "",
              department: "Engineering",
              location: "Remote",
              employmentType: "Full-time",
              experienceLevel: "Mid-Level",
              salaryRange: "",
              summary: "",
              responsibilities: [],
              requirements: [],
              postedDate: today(),
              closingDate: "",
              status: "Draft"
            }}
            fields={[
              { key: "title", label: "Job Title", kind: "text", placeholder: "e.g. Full-Stack AI Engineer" },
              { key: "summary", label: "Summary", kind: "textarea", rows: 5, placeholder: "Describe the vacancy and who should apply..." },
              { key: "responsibilities", label: "Responsibilities", kind: "array", zone: "details", placeholder: "Build React features, Integrate AI APIs" },
              { key: "requirements", label: "Requirements", kind: "array", zone: "details", placeholder: "React, Node.js, API experience" },
              { key: "department", label: "Department", kind: "select", zone: "side", options: ["Engineering", "Design", "Product", "Sales", "Marketing", "Operations"] },
              { key: "location", label: "Location", kind: "text", zone: "side", placeholder: "Remote / Hybrid / City" },
              { key: "employmentType", label: "Employment Type", kind: "select", zone: "side", options: ["Full-time", "Part-time", "Contract", "Internship"] },
              { key: "experienceLevel", label: "Experience Level", kind: "select", zone: "side", options: ["Entry-Level", "Junior", "Mid-Level", "Senior", "Lead"] },
              { key: "salaryRange", label: "Salary Range", kind: "text", zone: "side", placeholder: "Competitive / $..." },
              { key: "postedDate", label: "Posted Date", kind: "date", zone: "side" },
              { key: "closingDate", label: "Closing Date", kind: "date", zone: "side" }
            ]}
            loadItems={async () => (await getAdminCareers()).jobs as unknown as ResourceRecord[]}
            createItem={(data) => createCareer(data as unknown as Omit<Career, "_id" | "isMock">)}
            updateItem={(id, data) => updateCareer(id, data as unknown as Partial<Career>)}
            deleteItem={deleteCareer}
            listDetails={(item) => [String(item.department || ""), String(item.location || ""), String(item.employmentType || ""), String(item.closingDate || "Open")]}
          />
        </TabsContent>

        <TabsContent value="testimonials">
          <ResourceManager
            title="Testimonial"
            description="Fill in client feedback details and publish approved testimonials to the website."
            icon={<Users className="h-5 w-5" />}
            actionLabel="New Testimonial"
            listTitle="Testimonials"
            listDescription="Client feedback data loaded from /api/admin/testimonials."
            publishLabel="Approve Testimonial"
            draftLabel="Save as Pending"
            publishStatus="Approved"
            draftStatus="Pending"
            extraStatus={{ label: "Reject Testimonial", status: "Rejected", variant: "outline" }}
            defaultValues={{
              _id: "new",
              clientName: "",
              clientTitle: "",
              clientCompany: "",
              clientImage: "",
              rating: 5,
              testimonial: "",
              date: today(),
              industry: "Technology",
              serviceType: "Software Development",
              status: "Pending"
            }}
            fields={[
              { key: "clientName", label: "Client Name", kind: "text", placeholder: "e.g. Sarah Mitchell" },
              { key: "clientCompany", label: "Client Company", kind: "text", placeholder: "e.g. NovaTech Ltd." },
              { key: "clientTitle", label: "Client Title", kind: "text", placeholder: "e.g. Operations Manager" },
              { key: "date", label: "Date", kind: "date" },
              { key: "testimonial", label: "Testimonial Message", kind: "textarea", rows: 8, placeholder: "Write the client testimonial here..." },
              { key: "rating", label: "Rating", kind: "select", zone: "details", options: ["5", "4", "3", "2", "1"] },
              { key: "industry", label: "Industry", kind: "select", zone: "details", options: ["Technology", "Healthcare", "Education", "Finance", "Retail", "Manufacturing"] },
              { key: "serviceType", label: "Service Type", kind: "select", zone: "details", options: ["Software Development", "AI Automation", "Cloud Migration", "Data Analytics", "Cybersecurity", "Consulting"] },
              { key: "clientImage", label: "Client Image", kind: "image", zone: "side" }
            ]}
            loadItems={async () => (await getAdminTestimonials()).testimonials as unknown as ResourceRecord[]}
            createItem={(data) => createTestimonial(data as unknown as Omit<Testimonial, "_id" | "isMock">)}
            updateItem={(id, data) => updateTestimonial(id, data as unknown as Partial<Testimonial>)}
            deleteItem={deleteTestimonial}
            listDetails={(item) => [String(item.clientCompany || ""), String(item.clientTitle || ""), `${String(item.rating || 0)} stars`, String(item.date || "")]}
          />
        </TabsContent>

        <TabsContent value="gallery">
          <ResourceManager
            title="Gallery Image"
            description="Upload or link a promotional image for the website gallery."
            icon={<Image className="h-5 w-5" />}
            actionLabel="Upload Image"
            listTitle="Gallery Images"
            listDescription="Gallery data loaded from /api/admin/gallery."
            defaultValues={{
              _id: "new",
              title: "",
              url: "",
              category: "Events",
              description: "",
              uploadDate: today(),
              status: "Draft"
            }}
            fields={[
              { key: "title", label: "Image Title", kind: "text", placeholder: "e.g. AI Innovation Meetup 2026" },
              { key: "uploadDate", label: "Upload Date", kind: "date" },
              { key: "description", label: "Description", kind: "textarea", rows: 7, placeholder: "Describe what this promotional image represents..." },
              { key: "category", label: "Category", kind: "select", zone: "side", options: ["Events", "Workshops", "Team", "Office", "Product", "Community"] },
              { key: "url", label: "Gallery Image", kind: "image", zone: "side" }
            ]}
            loadItems={async () => (await getAdminGalleryImages()).images as unknown as ResourceRecord[]}
            createItem={(data) => createGalleryImage(data as unknown as Omit<GalleryImage, "_id" | "isMock">)}
            updateItem={(id, data) => updateGalleryImage(id, data as unknown as Partial<GalleryImage>)}
            deleteItem={deleteGalleryImage}
            listDetails={(item) => [String(item.category || ""), String(item.uploadDate || ""), String(item.description || "")]}
          />
        </TabsContent>

        <TabsContent value="team">
          <ResourceManager
            title="Team Member"
            description="Create and update public team profiles for the About page."
            icon={<UserRound className="h-5 w-5" />}
            actionLabel="New Member"
            listTitle="Team Members"
            listDescription="Team profiles loaded from /api/admin/team."
            publishLabel="Activate Member"
            draftLabel="Save as Draft"
            publishStatus="Active"
            draftStatus="Draft"
            defaultValues={{
              _id: "new",
              name: "",
              role: "",
              bio: "",
              image: "",
              expertise: [],
              linkedin: "",
              sortOrder: 1,
              status: "Draft"
            }}
            fields={[
              { key: "name", label: "Full Name", kind: "text", placeholder: "e.g. Maya Chen" },
              { key: "role", label: "Role", kind: "text", placeholder: "e.g. Full-Stack Engineer" },
              { key: "bio", label: "Short Bio", kind: "textarea", rows: 6, placeholder: "Write a concise public team bio..." },
              { key: "expertise", label: "Expertise", kind: "array", zone: "details", placeholder: "React, AI Strategy, Cloud" },
              { key: "linkedin", label: "LinkedIn URL", kind: "text", zone: "details", placeholder: "https://linkedin.com/in/..." },
              { key: "sortOrder", label: "Sort Order", kind: "number", zone: "side" },
              { key: "image", label: "Profile Image", kind: "image", zone: "side" }
            ]}
            loadItems={async () => (await getAdminTeamMembers()).members as unknown as ResourceRecord[]}
            createItem={(data) => createTeamMember(data as unknown as Omit<TeamMember, "_id" | "isMock">)}
            updateItem={(id, data) => updateTeamMember(id, data as unknown as Partial<TeamMember>)}
            deleteItem={deleteTeamMember}
            listDetails={(item) => [String(item.role || ""), `Order ${String(item.sortOrder || 0)}`, String(item.linkedin || "")]}
          />
        </TabsContent>

        <TabsContent value="faqs">
          <ResourceManager
            title="FAQ"
            description="Create and update About page FAQ answers from the backend."
            icon={<FileQuestion className="h-5 w-5" />}
            actionLabel="New FAQ"
            listTitle="FAQs"
            listDescription="FAQ records loaded from /api/admin/faqs."
            defaultValues={{
              _id: "new",
              title: "",
              question: "",
              answer: "",
              category: "General",
              sortOrder: 1,
              status: "Draft"
            }}
            fields={[
              { key: "question", label: "Question", kind: "text", placeholder: "e.g. How long does an AI project take?" },
              { key: "answer", label: "Answer", kind: "textarea", rows: 7, placeholder: "Write the public answer..." },
              { key: "category", label: "Category", kind: "select", zone: "details", options: ["General", "Services", "Delivery", "Pricing", "Support"] },
              { key: "sortOrder", label: "Sort Order", kind: "number", zone: "side" }
            ]}
            transformToPayload={(form) => ({ ...form, title: String(form.question || "") })}
            loadItems={async () => (await getAdminFaqs()).faqs as unknown as ResourceRecord[]}
            createItem={(data) => createFaq(data as unknown as Omit<Faq, "_id" | "isMock">)}
            updateItem={(id, data) => updateFaq(id, data as unknown as Partial<Faq>)}
            deleteItem={deleteFaq}
            listDetails={(item) => [String(item.category || ""), `Order ${String(item.sortOrder || 0)}`]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
