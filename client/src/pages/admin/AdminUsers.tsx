import { FormEvent, useEffect, useState } from "react";
import { Edit, Loader2, Plus, ShieldCheck, Trash2, UserCog, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { AdminUser, createUser, deleteUser, getUsers, updateUser, UserRole } from "@/api/users";

const fieldClass =
  "w-full rounded-xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none backdrop-blur transition focus:border-amber-400 focus:ring-2 focus:ring-amber-300/40 dark:border-white/10 dark:bg-slate-950/60 dark:text-white";
const labelClass = "mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300";

type UserForm = {
  id?: string;
  email: string;
  password: string;
  role: UserRole;
};

const emptyForm: UserForm = {
  email: "",
  password: "",
  role: "user"
};

export function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (user?.role === "admin") {
      void reload();
    } else {
      setLoading(false);
    }
  }, [user?.role]);

  async function reload() {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response.users);
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

  function startCreate() {
    setForm(emptyForm);
    setShowForm(true);
  }

  function startEdit(item: AdminUser) {
    setForm({ id: item.id, email: item.email, password: "", role: item.role });
    setShowForm(true);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!form.email || (!form.id && !form.password)) {
      setNotice({ type: "error", text: "Email and password are required for new users." });
      return;
    }

    try {
      setSaving(true);
      if (form.id) {
        await updateUser(form.id, {
          email: form.email,
          role: form.role,
          ...(form.password ? { password: form.password } : {})
        });
      } else {
        await createUser({ email: form.email, password: form.password, role: form.role });
      }

      await reload();
      setShowForm(false);
      showSuccess(form.id ? "User updated successfully." : "User created successfully.");
    } catch (error) {
      showError(error);
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: AdminUser) {
    if (!window.confirm(`Delete ${item.email}?`)) return;
    try {
      await deleteUser(item.id);
      await reload();
      showSuccess("User deleted successfully.");
    } catch (error) {
      showError(error);
    }
  }

  if (user?.role !== "admin") {
    return (
      <div className="honey-panel p-8">
        <div className="flex items-start gap-4">
          <ShieldCheck className="mt-1 h-6 w-6 text-amber-500" />
          <div>
            <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Admin only</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              User management is visible only to administrators. You can still use the rest of the dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Admin Dashboard</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">Users</h1>
          <p className="mt-1 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
            Create, edit, and delete dashboard users. This page is only available to admins.
          </p>
        </div>
        <Button onClick={startCreate} className="rounded-xl bg-black text-white hover:bg-slate-800">
          <Plus className="mr-2 h-4 w-4" />
          New User
        </Button>
      </div>

      {notice && (
        <div className={`rounded-xl border px-4 py-3 text-sm ${notice.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
          {notice.text}
        </div>
      )}

      {showForm && (
        <form onSubmit={save} className="honey-panel grid gap-5 p-6 md:grid-cols-2">
          <div>
            <label className={labelClass}>Email</label>
            <input className={fieldClass} type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>{form.id ? "New Password (Optional)" : "Password"}</label>
            <input className={fieldClass} type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Role</label>
            <select className={fieldClass} value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as UserRole }))}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex items-end gap-3">
            <Button disabled={saving} className="rounded-xl bg-black text-white hover:bg-slate-800">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {form.id ? "Update User" : "Create User"}
            </Button>
            <Button type="button" variant="ghost" className="rounded-xl" onClick={() => setShowForm(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </form>
      )}

      <Card className="honey-panel border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-white">
            <UserCog className="h-5 w-5" />
            Dashboard Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-300 py-14 text-sm text-slate-500 dark:border-white/10">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading users...
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((item) => (
                <div key={item.id} className="honey-card flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-950 dark:text-white">{item.email}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      Created {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "recently"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={item.role === "admin" ? "default" : "secondary"}>{item.role}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" disabled={item.id === user.id} onClick={() => void remove(item)}>
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
