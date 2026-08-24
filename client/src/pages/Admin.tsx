import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout, { type DashboardNavigationItem } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { activeManagedResources, managedCatalog } from "@/data/managedCatalog";
import { trpc } from "@/lib/trpc";
import { categoryValues, freeTypeValues, levelValues, audienceValues, GITHUB_PAGES_URL, type ManagedResource, type ManagedResourceInput } from "@shared/catalog";
import { Archive, CheckCircle2, CircleAlert, ExternalLink, FilePenLine, Github, Link2, Loader2, Plus, RadioTower, ShieldAlert, SquarePen } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

const githubRepositoryUrl = "https://github.com/Arzen-007/thearzens-intern-launchpad";

const navigationItems: DashboardNavigationItem[] = [
  { icon: RadioTower, label: "Resource control", path: "/admin" },
  { icon: ExternalLink, label: "Public launchpad", path: "/" },
];

const emptyDraft: ManagedResourceInput = {
  id: "",
  name: "",
  category: "Frontend",
  tag: "",
  freeType: "Free quota",
  summary: "",
  note: "Verify live country availability, limits, and account requirements before publishing.",
  url: "https://",
  recommendation: false,
  audience: "Developer",
  level: "Build",
};

function draftFromRecord(record: ManagedResource): ManagedResourceInput {
  const { status: _status, updatedAt: _updatedAt, ...draft } = record;
  return draft;
}

function CatalogEditor({ record, connected }: { record?: ManagedResource; connected: boolean }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ManagedResourceInput>(record ? draftFromRecord(record) : emptyDraft);
  const utils = trpc.useUtils();
  const upsert = trpc.catalog.upsert.useMutation({
    onSuccess: (result) => {
      toast.success(`Catalog ${result.action} committed to GitHub.`, { description: result.commit.sha.slice(0, 7) });
      void utils.catalog.status.invalidate();
      void utils.catalog.list.invalidate();
      setOpen(false);
    },
    onError: (error) => toast.error("Catalog change was not published.", { description: error.message }),
  });

  const update = <K extends keyof ManagedResourceInput>(key: K, value: ManagedResourceInput[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const canSubmit = connected && draft.id.trim() && draft.name.trim() && draft.summary.trim().length >= 20 && draft.note.trim().length >= 15 && draft.url.startsWith("https://");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={record ? "outline" : "default"} size={record ? "sm" : "default"} className={record ? "border-cyan-300/30 text-cyan-100 hover:bg-cyan-300/10" : "bg-cyan-300 text-slate-950 hover:bg-cyan-200"}>
          {record ? <SquarePen className="mr-2 h-3.5 w-3.5" /> : <Plus className="mr-2 h-4 w-4" />}
          {record ? "Edit" : "Add resource"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-cyan-300/30 bg-[#071018] text-cyan-50 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{record ? "Edit GitHub-managed resource" : "Add GitHub-managed resource"}</DialogTitle>
          <DialogDescription className="text-cyan-100/65">This form writes only to the versioned catalog file. The public Pages site updates after GitHub completes the deployment workflow.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2 sm:grid-cols-2">
          <div className="grid gap-2"><Label htmlFor="resource-id">Catalog ID</Label><Input id="resource-id" value={draft.id} onChange={(event) => update("id", event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} placeholder="provider-free-route" /><p className="text-xs text-cyan-100/45">Lowercase, numbers, and hyphens only.</p></div>
          <div className="grid gap-2"><Label htmlFor="resource-name">Provider / resource name</Label><Input id="resource-name" value={draft.name} onChange={(event) => update("name", event.target.value)} placeholder="Official provider name" /></div>
          <div className="grid gap-2"><Label>Technical category</Label><Select value={draft.category} onValueChange={(value) => update("category", value as ManagedResourceInput["category"])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{categoryValues.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>
          <div className="grid gap-2"><Label>Free-entry label</Label><Select value={draft.freeType} onValueChange={(value) => update("freeType", value as ManagedResourceInput["freeType"])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{freeTypeValues.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>
          <div className="grid gap-2"><Label htmlFor="resource-tag">Route tag</Label><Input id="resource-tag" value={draft.tag} onChange={(event) => update("tag", event.target.value)} placeholder="Free static deployment" /></div>
          <div className="grid gap-2"><Label htmlFor="resource-url">Official direct URL</Label><Input id="resource-url" value={draft.url} onChange={(event) => update("url", event.target.value)} placeholder="https://provider.example/free" /></div>
          <div className="grid gap-2"><Label>Audience</Label><Select value={draft.audience} onValueChange={(value) => update("audience", value as ManagedResourceInput["audience"])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{audienceValues.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>
          <div className="grid gap-2"><Label>Route level</Label><Select value={draft.level} onValueChange={(value) => update("level", value as ManagedResourceInput["level"])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{levelValues.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>
          <div className="grid gap-2 sm:col-span-2"><Label htmlFor="resource-summary">What it gives free</Label><Textarea id="resource-summary" value={draft.summary} onChange={(event) => update("summary", event.target.value)} placeholder="Describe the verified free entry, not a marketing claim." /></div>
          <div className="grid gap-2 sm:col-span-2"><Label htmlFor="resource-note">Pakistan / operational note</Label><Textarea id="resource-note" value={draft.note} onChange={(event) => update("note", event.target.value)} /></div>
        </div>
        {!connected && <p className="rounded border border-amber-300/30 bg-amber-300/10 p-3 text-sm text-amber-100">Publishing is locked until the private GitHub App is connected. No draft is stored locally or sent to GitHub.</p>}
        <DialogFooter><Button type="button" onClick={() => upsert.mutate({ resource: draft })} disabled={!canSubmit || upsert.isPending} className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">{upsert.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Committing</> : <><Github className="mr-2 h-4 w-4" />Commit catalog change</>}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ArchiveButton({ record, connected }: { record: ManagedResource; connected: boolean }) {
  const utils = trpc.useUtils();
  const archive = trpc.catalog.archive.useMutation({
    onSuccess: (result) => {
      toast.success("Resource archived in GitHub.", { description: result.commit.sha.slice(0, 7) });
      void utils.catalog.list.invalidate();
    },
    onError: (error) => toast.error("Archive was not published.", { description: error.message }),
  });
  return <Button size="sm" variant="outline" disabled={!connected || archive.isPending} onClick={() => archive.mutate({ id: record.id })} className="border-red-300/30 text-red-100 hover:bg-red-300/10"><Archive className="mr-2 h-3.5 w-3.5" />Archive</Button>;
}

function AdminContent() {
  const { user, loading } = useAuth();
  const status = trpc.catalog.status.useQuery(undefined, { enabled: user?.role === "admin" });
  const catalogQuery = trpc.catalog.list.useQuery(undefined, { enabled: user?.role === "admin" });
  const deployment = trpc.catalog.deployment.useQuery(undefined, { enabled: user?.role === "admin", refetchInterval: 30_000 });
  const connected = status.data?.connected ?? false;
  const catalog = catalogQuery.data?.catalog ?? managedCatalog;
  const active = catalog.resources.filter((resource) => resource.status === "active");
  const archived = catalog.resources.filter((resource) => resource.status === "archived");
  const usingSnapshot = !catalogQuery.data?.catalog;

  if (loading) return <div className="p-8 text-cyan-100">Loading owner access…</div>;
  if (user?.role !== "admin") {
    return <div className="mx-auto max-w-2xl px-6 py-16"><ShieldAlert className="mb-5 h-10 w-10 text-red-300" /><p className="font-mono text-xs uppercase tracking-[.2em] text-cyan-300">THE ARZENS // protected route</p><h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Owner access required.</h1><p className="mt-4 max-w-xl text-cyan-50/65">This control room is reserved for the THE ARZENS project owner. Public visitors can use the resource directory, but cannot view or alter the GitHub-managed catalog.</p><Link href="/"><Button className="mt-7 bg-cyan-300 text-slate-950 hover:bg-cyan-200">Return to launchpad</Button></Link></div>;
  }

  return <div className="mx-auto max-w-7xl space-y-7 px-2 py-5 sm:px-5">
    <header className="flex flex-col justify-between gap-5 border-b border-cyan-300/20 pb-6 lg:flex-row lg:items-end"><div><p className="font-mono text-xs uppercase tracking-[.2em] text-cyan-300">THE ARZENS // owner control</p><h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">Catalog control room</h1><p className="mt-3 max-w-2xl text-cyan-50/65">Manage the versioned resource overlay. Every approved change is designed to become a clear Git commit, then trigger the public Pages deployment.</p></div><div className="flex flex-wrap gap-3"><a href={githubRepositoryUrl} target="_blank" rel="noreferrer"><Button variant="outline" className="border-cyan-300/30 text-cyan-100 hover:bg-cyan-300/10"><Github className="mr-2 h-4 w-4" />Repository</Button></a><a href={GITHUB_PAGES_URL} target="_blank" rel="noreferrer"><Button variant="outline" className="border-cyan-300/30 text-cyan-100 hover:bg-cyan-300/10"><ExternalLink className="mr-2 h-4 w-4" />Pages site</Button></a><CatalogEditor connected={connected} /></div></header>

    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><div className="border border-cyan-300/20 bg-cyan-300/[.04] p-5"><p className="font-mono text-[10px] uppercase tracking-[.16em] text-cyan-100/55">Published overlay</p><p className="mt-2 text-4xl font-semibold text-white">{active.length}</p><p className="mt-1 text-sm text-cyan-100/60">active managed routes</p></div><div className="border border-cyan-300/20 bg-cyan-300/[.04] p-5"><p className="font-mono text-[10px] uppercase tracking-[.16em] text-cyan-100/55">Historical archive</p><p className="mt-2 text-4xl font-semibold text-white">{archived.length}</p><p className="mt-1 text-sm text-cyan-100/60">records retained, not published</p></div><div className={`border p-5 ${connected ? "border-emerald-300/35 bg-emerald-300/[.06]" : "border-amber-300/35 bg-amber-300/[.06]"}`}><p className="font-mono text-[10px] uppercase tracking-[.16em] text-cyan-100/55">GitHub publisher</p><div className="mt-2 flex items-center gap-2"><p className="text-xl font-semibold text-white">{status.isLoading ? "Checking…" : connected ? "Connected" : status.isError ? "Status unavailable" : "Waiting for App"}</p>{connected ? <CheckCircle2 className="h-5 w-5 text-emerald-300" /> : <ShieldAlert className="h-5 w-5 text-amber-300" />}</div><p className="mt-1 text-sm text-cyan-100/60">{status.isError ? status.error.message : connected ? "Repository-only catalog commits are enabled." : "Credentials remain server-side and are not configured yet."}</p></div><div className={`border p-5 ${deployment.data?.state === "published" ? "border-emerald-300/35 bg-emerald-300/[.06]" : deployment.data?.state === "failed" ? "border-red-300/35 bg-red-300/[.06]" : "border-cyan-300/20 bg-cyan-300/[.04]"}`}><p className="font-mono text-[10px] uppercase tracking-[.16em] text-cyan-100/55">Pages publication</p><div className="mt-2 flex items-center gap-2"><p className="text-xl font-semibold text-white">{deployment.isLoading ? "Checking…" : deployment.isError ? "Unavailable" : deployment.data?.state === "published" ? "Live" : deployment.data?.state === "running" ? "Deploying" : deployment.data?.state === "failed" ? "Needs review" : "Not deployed"}</p>{deployment.data?.state === "published" ? <CheckCircle2 className="h-5 w-5 text-emerald-300" /> : <RadioTower className="h-5 w-5 text-cyan-300" />}</div><p className="mt-1 text-sm text-cyan-100/60">{deployment.isError ? deployment.error.message : deployment.data?.message ?? (deployment.data?.runNumber ? `Workflow run #${deployment.data.runNumber}` : "Awaiting first workflow run.")}</p>{deployment.data?.runUrl && <a className="mt-2 inline-flex text-xs text-cyan-300 underline underline-offset-4" href={deployment.data.runUrl} target="_blank" rel="noreferrer">Open latest run</a>}</div></section>

    {!connected && <section className="flex flex-col gap-3 border border-amber-300/35 bg-amber-300/[.07] p-5 md:flex-row md:items-center md:justify-between"><div><p className="font-mono text-xs uppercase tracking-[.16em] text-amber-200">Connection gate</p><p className="mt-2 text-sm text-amber-50/85">The editor is ready, but publishing is intentionally locked. The private App needs only repository Contents read/write access and must be installed only on this Launchpad repository.</p>{status.data?.missing && <p className="mt-2 text-xs text-amber-100/60">Still required: {status.data.missing.join(" · ")}</p>}</div><FilePenLine className="h-8 w-8 shrink-0 text-amber-200" /></section>}

    {catalogQuery.isLoading && <section className="flex items-center gap-3 border border-cyan-300/20 bg-cyan-300/[.04] p-4 text-sm text-cyan-100/75"><Loader2 className="h-4 w-4 animate-spin text-cyan-300" />Loading the repository catalog state…</section>}
    {catalogQuery.isError && <section className="flex items-start gap-3 border border-red-300/35 bg-red-300/[.07] p-4 text-sm text-red-50"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-300" /><div><p className="font-medium">Repository catalog could not be read.</p><p className="mt-1 text-red-100/70">{catalogQuery.error.message} The entries below are an installed release snapshot only; do not use it to verify current GitHub state.</p></div></section>}
    {!catalogQuery.isError && usingSnapshot && <section className="flex items-start gap-3 border border-amber-300/30 bg-amber-300/[.06] p-4 text-sm text-amber-50"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" /><div><p className="font-medium">Showing the installed release snapshot.</p><p className="mt-1 text-amber-100/70">Live repository reads start automatically after the private GitHub App is connected. Until then, this table reflects the catalog bundled with this service release.</p></div></section>}

    <section className="overflow-hidden border border-cyan-300/20 bg-[#061017]"><div className="flex flex-col gap-3 border-b border-cyan-300/15 p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-mono text-xs uppercase tracking-[.16em] text-cyan-300">Repository catalog</p><h2 className="mt-1 text-xl font-semibold text-white">GitHub-managed resource records</h2></div><Badge variant="outline" className="w-fit border-cyan-300/30 text-cyan-100">{catalogQuery.isFetching ? "Refreshing catalog…" : `${active.length || activeManagedResources.length} live in Pages bundle`}</Badge></div>{catalog.resources.length === 0 ? <div className="grid min-h-72 place-items-center p-8 text-center"><div><Link2 className="mx-auto h-9 w-9 text-cyan-300" /><h3 className="mt-4 text-lg font-semibold text-white">The managed overlay is ready.</h3><p className="mt-2 max-w-md text-sm text-cyan-100/60">Core verified routes remain protected in source. Add a new officially verified free resource here once GitHub App publishing is connected.</p><div className="mt-5"><CatalogEditor connected={connected} /></div></div></div> : <div className="divide-y divide-cyan-300/10">{catalog.resources.map((record) => <article key={record.id} className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="text-base font-semibold text-white">{record.name}</h3><Badge variant="outline" className={record.status === "active" ? "border-emerald-300/30 text-emerald-200" : "border-slate-400/30 text-slate-300"}>{record.status}</Badge><Badge variant="outline" className="border-cyan-300/25 text-cyan-100">{record.category}</Badge></div><p className="mt-2 max-w-3xl text-sm text-cyan-100/65">{record.summary}</p><p className="mt-2 font-mono text-[10px] uppercase tracking-[.12em] text-cyan-100/40">{record.id} · updated {new Date(record.updatedAt).toLocaleString()}</p></div><div className="flex flex-wrap gap-2"><a href={record.url} target="_blank" rel="noreferrer"><Button size="sm" variant="outline" className="border-cyan-300/30 text-cyan-100 hover:bg-cyan-300/10"><ExternalLink className="mr-2 h-3.5 w-3.5" />Official page</Button></a><CatalogEditor record={record} connected={connected} />{record.status === "active" && <ArchiveButton record={record} connected={connected} />}</div></article>)}</div>}</section>
  </div>;
}

export default function Admin() {
  return <DashboardLayout navigationItems={navigationItems} title="THE ARZENS"><AdminContent /></DashboardLayout>;
}
