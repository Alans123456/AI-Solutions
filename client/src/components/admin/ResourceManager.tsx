import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { Edit, EyeOff, Loader2, Plus, Save, Trash2, Upload, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Primitive = string | number | boolean | string[] | undefined;
export type ResourceRecord = Record<string, Primitive> & {
  _id: string;
  status?: string;
  isMock?: boolean;
};

type FieldKind = "text" | "textarea" | "date" | "time" | "number" | "select" | "checkbox" | "array" | "image";
type FieldZone = "main" | "details" | "side";

export type FieldConfig = {
  key: string;
  label: string;
  kind: FieldKind;
  zone?: FieldZone;
  placeholder?: string;
  options?: string[];
  rows?: number;
};

type ResourceManagerProps = {
  title: string;
  description: string;
  icon: ReactNode;
  actionLabel: string;
  listTitle: string;
  listDescription: string;
  defaultValues: ResourceRecord;
  fields: FieldConfig[];
  publishLabel?: string;
  draftLabel?: string;
  publishStatus?: string;
  draftStatus?: string;
  extraStatus?: { label: string; status: string; variant?: "outline" | "ghost" };
  loadItems: () => Promise<ResourceRecord[]>;
  createItem: (data: ResourceRecord) => Promise<unknown>;
  updateItem: (id: string, data: ResourceRecord) => Promise<unknown>;
  deleteItem: (id: string) => Promise<unknown>;
  listDetails: (item: ResourceRecord) => string[];
  transformToForm?: (item: ResourceRecord) => ResourceRecord;
  transformToPayload?: (form: ResourceRecord) => ResourceRecord;
};

const fieldClass =
  "w-full rounded-xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none backdrop-blur transition focus:border-amber-400 focus:ring-2 focus:ring-amber-300/40 dark:border-white/10 dark:bg-slate-950/60 dark:text-white";
const labelClass = "mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300";
const panelClass = "honey-panel p-6";

export function ResourceManager({
  title,
  description,
  icon,
  actionLabel,
  listTitle,
  listDescription,
  defaultValues,
  fields,
  publishLabel = "Publish",
  draftLabel = "Save as Draft",
  publishStatus = "Published",
  draftStatus = "Draft",
  extraStatus,
  loadItems,
  createItem,
  updateItem,
  deleteItem,
  listDetails,
  transformToForm,
  transformToPayload
}: ResourceManagerProps) {
  const [items, setItems] = useState<ResourceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ResourceRecord>(defaultValues);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const sideFields = useMemo(() => fields.filter((field) => field.zone === "side" || field.kind === "image"), [fields]);
  const mainFields = useMemo(() => fields.filter((field) => !field.zone || field.zone === "main"), [fields]);
  const detailFields = useMemo(() => fields.filter((field) => field.zone === "details"), [fields]);

  useEffect(() => {
    void reload();
  }, []);

  async function reload() {
    try {
      setLoading(true);
      const loaded = await loadItems();
      setItems(loaded);
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  }

  function showError(error: unknown) {
    setNotice({ type: "error", text: error instanceof Error ? error.message : "Something went wrong." });
  }

  function showSuccess(text: string) {
    setNotice({ type: "success", text });
    window.setTimeout(() => setNotice(null), 3000);
  }

  function newForm() {
    setEditingId(null);
    setForm({ ...defaultValues, _id: "new", status: draftStatus });
    setShowForm(true);
  }

  function editForm(item: ResourceRecord) {
    if (item.isMock) return;
    setEditingId(item._id);
    setForm(transformToForm ? transformToForm(item) : item);
    setShowForm(true);
  }

  async function save(status: string) {
    const requiredTitle = String(form.title || form.clientName || form.name || form.question || form.email || "").trim();
    if (!requiredTitle) {
      setNotice({ type: "error", text: "Main title/name field is required." });
      return;
    }

    try {
      setSaving(true);
      const payload = transformToPayload ? transformToPayload({ ...form, status }) : { ...form, status };
      if (editingId) await updateItem(editingId, payload);
      else await createItem(payload);
      await reload();
      setShowForm(false);
      showSuccess(status === publishStatus ? `${title} published successfully.` : `${title} saved successfully.`);
    } catch (error) {
      showError(error);
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: ResourceRecord) {
    if (item.isMock) return;
    const name = String(item.title || item.clientName || item.name || item.question || item.email || "this record");
    if (!window.confirm(`Delete ${name}?`)) return;

    try {
      await deleteItem(item._id);
      await reload();
      showSuccess(`${title} deleted successfully.`);
    } catch (error) {
      showError(error);
    }
  }

  function setValue(key: string, value: Primitive) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>, key: string) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 1500000) {
      setNotice({ type: "error", text: "Image is too large. Use an image below 1.5MB or paste an image URL." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setValue(key, String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <FormHeading title={editingId ? `Edit ${title}` : `Add New ${title}`} description={description} />

        {notice && <NoticeBox notice={notice} />}

        <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <section className={panelClass}>
              <div className="grid gap-5">{mainFields.map((field) => renderField(field, form, setValue, handleImageUpload))}</div>
            </section>

            {detailFields.length > 0 && (
              <section className={panelClass}>
                <h3 className="mb-5 text-lg font-bold text-slate-950 dark:text-white">Details</h3>
                <div className="grid gap-5">{detailFields.map((field) => renderField(field, form, setValue, handleImageUpload))}</div>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            {sideFields.length > 0 && (
              <section className={panelClass}>
                <div className="grid gap-5">{sideFields.map((field) => renderField(field, form, setValue, handleImageUpload))}</div>
              </section>
            )}

            <section className={panelClass}>
              <div className="grid gap-3">
                <Button type="button" disabled={saving} className="rounded-xl bg-black py-6 text-white hover:bg-slate-800" onClick={() => void save(publishStatus)}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  {publishLabel}
                </Button>
                <Button type="button" disabled={saving} variant="outline" className="rounded-xl border-black py-6" onClick={() => void save(draftStatus)}>
                  <Save className="mr-2 h-4 w-4" />
                  {draftLabel}
                </Button>
                {extraStatus && (
                  <Button type="button" disabled={saving} variant={extraStatus.variant || "outline"} className="rounded-xl py-6" onClick={() => void save(extraStatus.status)}>
                    {extraStatus.label}
                  </Button>
                )}
                <Button type="button" variant="ghost" className="rounded-xl py-6 text-red-600 hover:text-red-700" onClick={() => setShowForm(false)}>
                  Discard Changes
                </Button>
              </div>
            </section>

            <section className="honey-panel border-dashed p-5">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">Live Preview Status</p>
              <div className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                <EyeOff className="mt-0.5 h-4 w-4" />
                <p>
                  Current status: <strong>{String(form.status || draftStatus)}</strong>
                </p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <FormHeading title={listTitle} description={listDescription} />
        <Button onClick={newForm} className="rounded-xl bg-black text-white hover:bg-slate-800">
          <Plus className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      </div>

      {notice && <NoticeBox notice={notice} />}

      <Card className="honey-panel border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-white">
            {icon}
            {listTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-300 py-14 text-sm text-slate-500 dark:border-white/10">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading content from API...
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item._id} className="honey-card flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-950 dark:text-white">{String(item.title || item.clientName || item.name || item.question || item.email || "Untitled")}</h3>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
                      {listDetails(item).filter(Boolean).map((detail) => (
                        <span key={detail}>{detail}</span>
                      ))}
                    </div>
                    {item.isMock && <p className="mt-2 text-xs text-slate-500">Mock fallback data. Create a SQLite record before editing or deleting.</p>}
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={item.status === draftStatus || item.status === "Pending" ? "secondary" : "default"}>{String(item.status || "Published")}</Badge>
                    {item.isMock && <Badge variant="outline">Mock</Badge>}
                    <Button variant="ghost" size="sm" disabled={item.isMock} onClick={() => editForm(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" disabled={item.isMock} onClick={() => void remove(item)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function FormHeading({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Admin Dashboard</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">{title}</h1>
      <p className="mt-1 max-w-3xl text-sm text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  );
}

function NoticeBox({ notice }: { notice: { type: "success" | "error"; text: string } }) {
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${notice.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
      {notice.text}
    </div>
  );
}

function renderField(
  field: FieldConfig,
  form: ResourceRecord,
  setValue: (key: string, value: Primitive) => void,
  handleImageUpload: (event: ChangeEvent<HTMLInputElement>, key: string) => void
) {
  const value = form[field.key];

  if (field.kind === "checkbox") {
    return (
      <label key={field.key} className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white/60 px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-950/50">
        <input type="checkbox" checked={Boolean(value)} onChange={(event) => setValue(field.key, event.target.checked)} />
        {field.label}
      </label>
    );
  }

  if (field.kind === "textarea") {
    return (
      <div key={field.key}>
        <label className={labelClass}>{field.label}</label>
        <textarea
          className={`${fieldClass} min-h-${field.rows || 32} resize-none`}
          rows={field.rows || 5}
          value={String(value || "")}
          placeholder={field.placeholder}
          onChange={(event) => setValue(field.key, event.target.value)}
        />
      </div>
    );
  }

  if (field.kind === "select") {
    return (
      <div key={field.key}>
        <label className={labelClass}>{field.label}</label>
        <select className={fieldClass} value={String(value || "")} onChange={(event) => setValue(field.key, event.target.value)}>
          {(field.options || []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.kind === "array") {
    const arrayValue = Array.isArray(value) ? value : [];
    return (
      <ArrayField
        key={field.key}
        label={field.label}
        placeholder={field.placeholder}
        values={arrayValue}
        onChange={(next) => setValue(field.key, next)}
      />
    );
  }

  if (field.kind === "image") {
    const image = String(value || "");
    return (
      <div key={field.key}>
        <label className={labelClass}>{field.label}</label>
        <label className="relative flex min-h-36 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-slate-300 bg-white/70 text-center text-sm text-slate-600 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-300">
          <input type="file" accept="image/*" className="hidden" onChange={(event) => handleImageUpload(event, field.key)} />
          {image ? (
            <img src={image} alt={field.label} className="h-40 w-full object-cover" />
          ) : (
            <>
              <div className="absolute left-0 top-0 h-px w-[145%] origin-left rotate-[27deg] bg-slate-300" />
              <div className="absolute bottom-0 left-0 h-px w-[145%] origin-left -rotate-[27deg] bg-slate-300" />
              <div className="relative flex flex-col items-center gap-2">
                <Upload className="h-6 w-6" />
                <span>Click to upload image</span>
              </div>
            </>
          )}
        </label>
        <p className="mt-2 text-center text-[10px] text-slate-500">Recommended size: 1200×675px · 16:9</p>
        <input className={`${fieldClass} mt-3`} value={image} placeholder="Or paste image URL here" onChange={(event) => setValue(field.key, event.target.value)} />
      </div>
    );
  }

  return (
    <div key={field.key}>
      <label className={labelClass}>{field.label}</label>
      <input
        type={field.kind}
        className={fieldClass}
        value={String(value || "")}
        placeholder={field.placeholder}
        onChange={(event) => setValue(field.key, field.kind === "number" ? Number(event.target.value) : event.target.value)}
      />
    </div>
  );
}

function ArrayField({ label, placeholder, values, onChange }: { label: string; placeholder?: string; values: string[]; onChange: (values: string[]) => void }) {
  const [draft, setDraft] = useState("");

  function add() {
    const next = draft
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .filter((item) => !values.some((existing) => existing.toLowerCase() === item.toLowerCase()));
    if (!next.length) return;
    onChange([...values, ...next]);
    setDraft("");
  }

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex gap-2">
        <input
          className={fieldClass}
          value={draft}
          placeholder={placeholder || "Add items, comma separated..."}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              add();
            }
          }}
        />
        <Button type="button" variant="outline" className="rounded-xl" onClick={add}>
          Add
        </Button>
      </div>
      {values.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {values.map((item) => (
            <button
              key={item}
              type="button"
              className="flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-3 py-1 text-xs text-slate-800 hover:bg-slate-100 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200"
              onClick={() => onChange(values.filter((value) => value !== item))}
            >
              {item}
              <X className="h-3 w-3" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
