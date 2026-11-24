"use client";

import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CalendarHeart,
  Check,
  ChevronDown,
  CircleHelp,
  ExternalLink,
  FileCheck2,
  LayoutDashboard,
  MapPin,
  Menu,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sun,
  Trash2,
  Trophy,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  useMemo,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";

type ApplicationStatus =
  | "Applied"
  | "Interview"
  | "Assessment"
  | "Offer"
  | "Rejected";

type Application = {
  id: string;
  company: string;
  position: string;
  applicationDate: string;
  location: string;
  salary: string;
  postingUrl: string;
  status: ApplicationStatus;
  followUpDate: string | null;
};

type View = "dashboard" | "applications" | "companies" | "follow-ups" | "settings";

const STORAGE_KEY = "applytrack.applications";
const THEME_KEY = "applytrack.dark-mode";
const STORAGE_ERROR = "__applytrack_storage_error__";
const STORAGE_EVENT = "applytrack-storage-change";
const statuses: ApplicationStatus[] = [
  "Applied",
  "Interview",
  "Assessment",
  "Offer",
  "Rejected",
];

const sampleApplications: Application[] = [
  {
    id: "sample-1",
    company: "Linear",
    position: "Product Designer",
    applicationDate: "2026-11-21",
    location: "San Francisco, CA",
    salary: "$145k – $175k",
    postingUrl: "https://linear.app",
    status: "Interview",
    followUpDate: "2026-11-27",
  },
  {
    id: "sample-2",
    company: "Vercel",
    position: "Frontend Engineer",
    applicationDate: "2026-11-19",
    location: "Remote",
    salary: "$160k – $195k",
    postingUrl: "https://vercel.com/careers",
    status: "Applied",
    followUpDate: "2026-11-26",
  },
  {
    id: "sample-3",
    company: "Figma",
    position: "Product Designer",
    applicationDate: "2026-11-17",
    location: "New York, NY",
    salary: "$150k – $185k",
    postingUrl: "https://figma.com/careers",
    status: "Assessment",
    followUpDate: null,
  },
  {
    id: "sample-4",
    company: "Notion",
    position: "Product Manager",
    applicationDate: "2026-11-14",
    location: "San Francisco, CA",
    salary: "$155k – $190k",
    postingUrl: "https://notion.so/careers",
    status: "Interview",
    followUpDate: "2026-11-25",
  },
  {
    id: "sample-5",
    company: "Stripe",
    position: "Software Engineer",
    applicationDate: "2026-11-12",
    location: "Remote",
    salary: "$170k – $210k",
    postingUrl: "https://stripe.com/jobs",
    status: "Offer",
    followUpDate: null,
  },
  {
    id: "sample-6",
    company: "Ramp",
    position: "UX Researcher",
    applicationDate: "2026-11-09",
    location: "New York, NY",
    salary: "$130k – $160k",
    postingUrl: "https://ramp.com/careers",
    status: "Applied",
    followUpDate: "2026-11-28",
  },
  {
    id: "sample-7",
    company: "Webflow",
    position: "Product Designer",
    applicationDate: "2026-11-05",
    location: "Remote",
    salary: "$135k – $165k",
    postingUrl: "https://webflow.com/careers",
    status: "Rejected",
    followUpDate: null,
  },
];

const statusStyles: Record<ApplicationStatus, string> = {
  Applied: "status-applied",
  Interview: "status-interview",
  Assessment: "status-assessment",
  Offer: "status-offer",
  Rejected: "status-rejected",
};

const statusLabels: Record<ApplicationStatus, string> = {
  Applied: "Applied",
  Interview: "Interview",
  Assessment: "Assessment",
  Offer: "Offer",
  Rejected: "Rejected",
};

const navigation: { id: View; label: string; icon: LucideIcon }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "applications", label: "My Applications", icon: BriefcaseBusiness },
  { id: "companies", label: "Companies", icon: Building2 },
  { id: "follow-ups", label: "Follow-ups", icon: CalendarHeart },
  { id: "settings", label: "Settings", icon: Settings },
];

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(STORAGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
}

function getApplicationsSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return STORAGE_ERROR;
  }
}

function getThemeSnapshot() {
  try {
    return window.localStorage.getItem(THEME_KEY) ?? "false";
  } catch {
    return STORAGE_ERROR;
  }
}

function getLoadedSnapshot() {
  return true;
}

function getServerApplicationsSnapshot() {
  return "";
}

function getServerThemeSnapshot() {
  return "false";
}

function getServerLoadedSnapshot() {
  return false;
}

function publishStorageChange() {
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

function isApplicationList(value: unknown): value is Application[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        typeof item.id === "string" &&
        "company" in item &&
        typeof item.company === "string" &&
        "position" in item &&
        typeof item.position === "string" &&
        "applicationDate" in item &&
        typeof item.applicationDate === "string" &&
        "location" in item &&
        typeof item.location === "string" &&
        "salary" in item &&
        typeof item.salary === "string" &&
        "postingUrl" in item &&
        typeof item.postingUrl === "string" &&
        "status" in item &&
        statuses.includes(item.status as ApplicationStatus) &&
        "followUpDate" in item &&
        (typeof item.followUpDate === "string" || item.followUpDate === null),
    )
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className={`status-pill ${statusStyles[status]}`}>
      <span className="status-dot" />
      {statusLabels[status]}
    </span>
  );
}

function ApplicationTable({
  applications,
  onDelete,
  sortDirection,
  onToggleSort,
  isLoading,
}: {
  applications: Application[];
  onDelete: (id: string) => void;
  sortDirection: "asc" | "desc";
  onToggleSort: () => void;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="empty-state">
        <div className="loading-indicator" />
        <p>Loading your applications…</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <BriefcaseBusiness size={22} />
        </div>
        <h3>No applications found</h3>
        <p>Try adjusting your search or filters to find what you’re looking for.</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-scroll">
        <table className="applications-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Position</th>
              <th>
                <button className="sort-button" onClick={onToggleSort} type="button">
                  Applied
                  {sortDirection === "desc" ? (
                    <ArrowDown size={13} />
                  ) : (
                    <ArrowUp size={13} />
                  )}
                </button>
              </th>
              <th>Location</th>
              <th>Estimated salary</th>
              <th>Status</th>
              <th className="actions-heading">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id}>
                <td>
                  <div className="company-cell">
                    <span className={`company-mark mark-${application.company.length % 5}`}>
                      {application.company.slice(0, 1)}
                    </span>
                    <span className="company-name">{application.company}</span>
                  </div>
                </td>
                <td className="position-cell">{application.position}</td>
                <td className="date-cell">{formatDate(application.applicationDate)}</td>
                <td className="location-cell">
                  <MapPin size={14} />
                  {application.location}
                </td>
                <td className="salary-cell">{application.salary || "—"}</td>
                <td>
                  <StatusBadge status={application.status} />
                </td>
                <td>
                  <div className="row-actions">
                    {application.postingUrl ? (
                      <a
                        aria-label={`Open ${application.company} job posting`}
                        className="icon-button"
                        href={application.postingUrl}
                        rel="noreferrer"
                        target="_blank"
                        title="Open job posting"
                      >
                        <ExternalLink size={15} />
                      </a>
                    ) : null}
                    <button
                      aria-label={`Delete ${application.position} at ${application.company}`}
                      className="icon-button delete-action"
                      onClick={() => onDelete(application.id)}
                      title="Delete application"
                      type="button"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="application-cards">
        {applications.map((application) => (
          <article className="application-card" key={application.id}>
            <div className="application-card-top">
              <div className="company-cell">
                <span className={`company-mark mark-${application.company.length % 5}`}>
                  {application.company.slice(0, 1)}
                </span>
                <div>
                  <p className="company-name">{application.company}</p>
                  <p className="position-cell">{application.position}</p>
                </div>
              </div>
              <StatusBadge status={application.status} />
            </div>
            <div className="application-card-meta">
              <span>
                <CalendarDays size={14} />
                {formatDate(application.applicationDate)}
              </span>
              <span>
                <MapPin size={14} />
                {application.location}
              </span>
              <span>{application.salary || "Salary not listed"}</span>
            </div>
            <div className="application-card-actions">
              {application.postingUrl ? (
                <a
                  className="text-link"
                  href={application.postingUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  View posting <ExternalLink size={13} />
                </a>
              ) : (
                <span />
              )}
              <button
                aria-label={`Delete ${application.position} at ${application.company}`}
                className="icon-button delete-action"
                onClick={() => onDelete(application.id)}
                type="button"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function AddApplicationDialog({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (application: Application) => void;
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSave({
      id: crypto.randomUUID(),
      company: String(formData.get("company")).trim(),
      position: String(formData.get("position")).trim(),
      applicationDate: String(formData.get("applicationDate")),
      location: String(formData.get("location")).trim(),
      salary: String(formData.get("salary")).trim(),
      postingUrl: String(formData.get("postingUrl")).trim(),
      status: String(formData.get("status")) as ApplicationStatus,
      followUpDate: null,
    });
  }

  return (
    <div
      className="dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="add-application-title"
        aria-modal="true"
        className="dialog-panel"
        role="dialog"
      >
        <div className="dialog-header">
          <div>
            <span className="eyebrow">KEEP YOUR SEARCH ON TRACK</span>
            <h2 id="add-application-title">Add an application</h2>
            <p>Add the details now. You can update your progress anytime.</p>
          </div>
          <button
            aria-label="Close dialog"
            className="icon-button"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>
        <form className="application-form" onSubmit={handleSubmit}>
          <label>
            Company name <span className="required-mark">*</span>
            <input autoFocus className="control" name="company" placeholder="e.g. Acme Inc." required />
          </label>
          <label>
            Job title <span className="required-mark">*</span>
            <input
              className="control"
              name="position"
              placeholder="e.g. Product Designer"
              required
            />
          </label>
          <div className="form-grid">
            <label>
              Salary range
              <input className="control" name="salary" placeholder="$120k – $150k" />
            </label>
            <label>
              Location <span className="required-mark">*</span>
              <input className="control" name="location" placeholder="Remote or city" required />
            </label>
          </div>
          <div className="form-grid">
            <label>
              Application date <span className="required-mark">*</span>
              <input
                className="control"
                defaultValue={new Date().toISOString().slice(0, 10)}
                name="applicationDate"
                required
                type="date"
              />
            </label>
            <label>
              Application status
              <select className="control" defaultValue="Applied" name="status">
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Job posting URL
            <input
              className="control"
              name="postingUrl"
              placeholder="https://company.com/careers/job"
              type="url"
            />
          </label>
          <div className="dialog-actions">
            <button className="button-secondary" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="button-primary" type="submit">
              <Plus size={16} />
              Save application
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function Dashboard() {
  const savedApplications = useSyncExternalStore(
    subscribeToStorage,
    getApplicationsSnapshot,
    getServerApplicationsSnapshot,
  );
  const savedTheme = useSyncExternalStore(
    subscribeToStorage,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const isLoaded = useSyncExternalStore(
    subscribeToStorage,
    getLoadedSnapshot,
    getServerLoadedSnapshot,
  );
  const [applicationOverride, setApplicationOverride] = useState<Application[] | null>(null);
  const [view, setView] = useState<View>("dashboard");
  const [filter, setFilter] = useState("All statuses");
  const [search, setSearch] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [isErrorDismissed, setIsErrorDismissed] = useState(false);
  const [sampleReset, setSampleReset] = useState(false);
  const [applicationsCouldNotSave, setApplicationsCouldNotSave] = useState(false);

  const parsedStorage = useMemo(() => {
    if (savedApplications === STORAGE_ERROR) {
      return {
        applications: sampleApplications,
        usingSamples: true,
        error: "Saved data could not be loaded. Your sample dashboard is still available.",
      };
    }
    if (!savedApplications) {
      return { applications: sampleApplications, usingSamples: true, error: "" };
    }
    try {
      const parsed: unknown = JSON.parse(savedApplications);
      if (!isApplicationList(parsed)) {
        throw new Error("Saved application data is not valid.");
      }
      return { applications: parsed, usingSamples: false, error: "" };
    } catch {
      return {
        applications: sampleApplications,
        usingSamples: true,
        error: "Saved data is invalid. Your sample dashboard is still available.",
      };
    }
  }, [savedApplications]);
  const applications = applicationOverride ?? parsedStorage.applications;
  const isDarkMode = savedTheme === "true";
  const usingSampleData =
    sampleReset || (applicationOverride === null && parsedStorage.usingSamples);
  const visibleStorageError =
    storageError ||
    (isErrorDismissed
      ? ""
      : parsedStorage.error ||
        (savedTheme === STORAGE_ERROR ? "Your saved display preferences could not be loaded." : ""));

  function persistApplications(nextApplications: Application[]) {
    setApplicationOverride(nextApplications);
    setSampleReset(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextApplications));
      setStorageError("");
      setIsErrorDismissed(false);
      setApplicationsCouldNotSave(false);
      publishStorageChange();
    } catch {
      setStorageError("Changes are visible now, but could not be saved to this browser.");
      setIsErrorDismissed(false);
      setApplicationsCouldNotSave(true);
    }
  }

  function toggleTheme() {
    const nextTheme = !isDarkMode;
    try {
      window.localStorage.setItem(THEME_KEY, String(nextTheme));
      setStorageError("");
      setIsErrorDismissed(false);
      publishStorageChange();
    } catch {
      setStorageError("Your theme preference could not be saved to this browser.");
      setIsErrorDismissed(false);
    }
  }

  function resetToSamples() {
    setApplicationOverride(sampleApplications);
    setSampleReset(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleApplications));
      setStorageError("");
      setIsErrorDismissed(false);
      setApplicationsCouldNotSave(false);
      publishStorageChange();
    } catch {
      setStorageError("Sample data is visible now, but could not be saved to this browser.");
      setIsErrorDismissed(false);
      setApplicationsCouldNotSave(true);
    }
  }

  function addApplication(application: Application) {
    persistApplications([application, ...applications]);
    setIsDialogOpen(false);
    setView("applications");
    setFilter("All statuses");
    setSearch("");
  }

  function deleteApplication(id: string) {
    persistApplications(applications.filter((application) => application.id !== id));
  }

  function selectView(nextView: View) {
    setView(nextView);
    setIsMobileNavOpen(false);
  }

  const counts = useMemo(
    () => ({
      total: applications.length,
      applied: applications.filter((application) => application.status === "Applied").length,
      interviews: applications.filter((application) => application.status === "Interview").length,
      assessments: applications.filter((application) => application.status === "Assessment").length,
      offers: applications.filter((application) => application.status === "Offer").length,
      rejected: applications.filter((application) => application.status === "Rejected").length,
    }),
    [applications],
  );

  const visibleApplications = useMemo(() => {
    const query = search.trim().toLowerCase();
    return applications
      .filter((application) => filter === "All statuses" || application.status === filter)
      .filter(
        (application) =>
          !query ||
          application.company.toLowerCase().includes(query) ||
          application.position.toLowerCase().includes(query),
      )
      .sort((first, second) => {
        const difference =
          new Date(first.applicationDate).getTime() - new Date(second.applicationDate).getTime();
        return sortDirection === "desc" ? -difference : difference;
      });
  }, [applications, filter, search, sortDirection]);

  const metrics: {
    label: string;
    count: number;
    icon: LucideIcon;
    color: string;
    status: ApplicationStatus | "All statuses";
    detail: string;
  }[] = [
    { label: "Total applications", count: counts.total, icon: BriefcaseBusiness, color: "blue", status: "All statuses", detail: "Across your search" },
    { label: "Applied", count: counts.applied, icon: FileCheck2, color: "slate", status: "Applied", detail: "Waiting to hear back" },
    { label: "Interviews", count: counts.interviews, icon: Users, color: "violet", status: "Interview", detail: "You’re moving forward" },
    { label: "Assessments", count: counts.assessments, icon: CalendarDays, color: "amber", status: "Assessment", detail: "Show what you can do" },
    { label: "Job offers", count: counts.offers, icon: Trophy, color: "green", status: "Offer", detail: "A great next step" },
    { label: "Umalis na, Ayoko na", count: counts.rejected, icon: X, color: "rose", status: "Rejected", detail: "Part of the journey" },
  ];

  const pageTitle =
    view === "dashboard"
      ? "Dashboard"
      : view === "applications"
        ? "My Applications"
        : view === "companies"
          ? "Companies"
          : view === "follow-ups"
            ? "Follow-ups"
            : "Settings";

  const followUps = applications
    .filter((application) => application.followUpDate !== null)
    .sort((first, second) =>
      (first.followUpDate ?? "").localeCompare(second.followUpDate ?? ""),
    );

  return (
    <div className={`dashboard-root min-h-screen antialiased${isDarkMode ? " theme-dark" : ""}`}>
      {isMobileNavOpen ? (
        <button
          aria-label="Close navigation"
          className="sidebar-backdrop"
          onClick={() => setIsMobileNavOpen(false)}
          type="button"
        />
      ) : null}
      <aside className={`sidebar${isMobileNavOpen ? " sidebar-open" : ""}`}>
        <div className="brand-lockup">
          <span className="brand-symbol">
            <BriefcaseBusiness size={18} strokeWidth={2.2} />
          </span>
          <span className="brand-name">ApplyTrack</span>
          <button
            aria-label="Close navigation"
            className="icon-button mobile-close"
            onClick={() => setIsMobileNavOpen(false)}
            type="button"
          >
            <X size={18} />
          </button>
        </div>
        <div className="workspace-switcher">
          <span className="workspace-avatar">JD</span>
          <span className="workspace-copy">
            <strong>Personal workspace</strong>
            <small>Free plan</small>
          </span>
          <ChevronDown size={15} />
        </div>
        <nav aria-label="Main navigation" className="sidebar-navigation">
          <p className="nav-section-label">WORKSPACE</p>
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              aria-current={view === id ? "page" : undefined}
              className={`nav-link${view === id ? " nav-link-active" : ""}`}
              key={id}
              onClick={() => selectView(id)}
              type="button"
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
              {id === "follow-ups" && followUps.length > 0 ? (
                <span className="nav-count">{followUps.length}</span>
              ) : null}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="tip-icon">
              <CircleHelp size={17} />
            </span>
            <div>
              <strong>Make every follow-up count</strong>
              <p>A little consistency goes a long way.</p>
            </div>
          </div>
          <button className="profile-button" onClick={() => selectView("settings")} type="button">
            <span className="profile-avatar">JD</span>
            <span className="profile-copy">
              <strong>Jordan Davis</strong>
              <small>jordan@example.com</small>
            </span>
            <MoreHorizontal size={18} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              aria-label="Open navigation"
              className="icon-button mobile-menu"
              onClick={() => setIsMobileNavOpen(true)}
              type="button"
            >
              <Menu size={19} />
            </button>
            <div className="breadcrumbs">
              <span>Workspace</span>
              <span className="breadcrumb-separator">/</span>
              <strong>{pageTitle}</strong>
            </div>
          </div>
          <div className="topbar-actions">
            <button
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="icon-button topbar-icon"
              onClick={toggleTheme}
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              type="button"
            >
              {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button
              aria-label="View follow-ups"
              className="icon-button topbar-icon"
              onClick={() => selectView("follow-ups")}
              title="View follow-ups"
              type="button"
            >
              <Bell size={17} />
              <span className="notification-dot" />
            </button>
            <span className="topbar-divider" />
            <span className="topbar-avatar">JD</span>
          </div>
        </header>

        <div className="page-content">
          {visibleStorageError ? (
            <div className="storage-alert" role="status">
              <span>{visibleStorageError}</span>
              <button
                aria-label="Dismiss message"
                className="alert-dismiss"
                onClick={() => {
                  setStorageError("");
                  setIsErrorDismissed(true);
                }}
                type="button"
              >
                <X size={15} />
              </button>
            </div>
          ) : null}

          {view === "dashboard" ? (
            <>
              <section className="page-heading dashboard-heading">
                <div>
                  <div className="eyebrow">
                    {isLoaded
                      ? new Intl.DateTimeFormat("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })
                          .format(new Date())
                          .toUpperCase()
                      : "YOUR JOB SEARCH"}
                  </div>
                  <h1>Your search, at a glance</h1>
                  <p>Keep your momentum going. You’re doing great.</p>
                </div>
                <div className="heading-actions">
                  <span
                    className={`data-label${usingSampleData ? "" : " data-label-saved"}${applicationsCouldNotSave ? " data-label-error" : ""}`}
                  >
                    <span className="data-label-dot" />
                    {applicationsCouldNotSave
                      ? "Not saved"
                      : usingSampleData
                        ? "Sample data"
                        : "Saved locally"}
                  </span>
                  <button
                    className="button-primary"
                    onClick={() => setIsDialogOpen(true)}
                    type="button"
                  >
                    <Plus size={17} />
                    Add application
                  </button>
                </div>
              </section>

              <section aria-label="Application statistics" className="metrics-grid">
                {metrics.map(({ label, count, icon: Icon, color, status, detail }) => (
                  <button
                    aria-label={`Show ${status === "All statuses" ? "all" : statusLabels[status].toLowerCase()} applications`}
                    className="metric-card"
                    key={label}
                    onClick={() => {
                      setFilter(status);
                      setView("applications");
                    }}
                    type="button"
                  >
                    <div className="metric-card-top">
                      <span className="metric-label">{label}</span>
                      <span className={`metric-icon metric-${color}`}>
                        <Icon size={17} strokeWidth={1.9} />
                      </span>
                    </div>
                    <div className="metric-count">{count}</div>
                    <div className="metric-detail">{detail}</div>
                  </button>
                ))}
              </section>

              <ApplicationSection
                applications={visibleApplications.slice(0, 5)}
                filter={filter}
                isLoading={!isLoaded}
                onDelete={deleteApplication}
                onFilter={setFilter}
                onSearch={setSearch}
                onShowAll={() => selectView("applications")}
                onToggleSort={() =>
                  setSortDirection((direction) => (direction === "desc" ? "asc" : "desc"))
                }
                search={search}
                sortDirection={sortDirection}
                title="Recent applications"
                totalCount={applications.length}
              />

              <div className="dashboard-bottom-grid">
                <section className="panel pipeline-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Application pipeline</h2>
                      <p>A quick look at where things stand.</p>
                    </div>
                    <span className="period-label">All time</span>
                  </div>
                  <div className="pipeline-bars">
                    {metrics.slice(1).map(({ label, count, color, status }) => (
                      <button
                        aria-label={`Filter ${status === "All statuses" ? "all" : statusLabels[status]} applications`}
                        className="pipeline-row"
                        key={label}
                        onClick={() => {
                          setFilter(status);
                          setView("applications");
                        }}
                        type="button"
                      >
                        <span className="pipeline-label">{label}</span>
                        <span className="pipeline-track">
                          <span
                            className={`pipeline-fill pipeline-${color}`}
                            style={{
                              width: `${counts.total ? Math.max((count / counts.total) * 100, count ? 8 : 0) : 0}%`,
                            }}
                          />
                        </span>
                        <span className="pipeline-count">{count}</span>
                      </button>
                    ))}
                  </div>
                </section>
                <section className="panel focus-panel">
                  <div className="focus-icon">
                    <CalendarHeart size={20} />
                  </div>
                  <div className="focus-content">
                    <span className="eyebrow">UP NEXT</span>
                    <h2>{followUps.length} follow-ups to stay on top of</h2>
                    <p>A timely note can make all the difference.</p>
                    <button className="text-link" onClick={() => selectView("follow-ups")} type="button">
                      View follow-ups <ArrowRight size={14} />
                    </button>
                  </div>
                </section>
              </div>
            </>
          ) : null}

          {view === "applications" ? (
            <>
              <section className="page-heading">
                <div>
                  <div className="eyebrow">YOUR JOB SEARCH</div>
                  <h1>My applications</h1>
                  <p>Every opportunity, organized in one place.</p>
                </div>
                <button
                  className="button-primary"
                  onClick={() => setIsDialogOpen(true)}
                  type="button"
                >
                  <Plus size={17} />
                  Add application
                </button>
              </section>
              <ApplicationSection
                applications={visibleApplications}
                filter={filter}
                isLoading={!isLoaded}
                onDelete={deleteApplication}
                onFilter={setFilter}
                onSearch={setSearch}
                onToggleSort={() =>
                  setSortDirection((direction) => (direction === "desc" ? "asc" : "desc"))
                }
                search={search}
                sortDirection={sortDirection}
                title="All applications"
                totalCount={applications.length}
              />
            </>
          ) : null}

          {view === "companies" ? (
            <CompaniesView applications={applications} onAdd={() => setIsDialogOpen(true)} />
          ) : null}

          {view === "follow-ups" ? (
            <FollowUpsView
              applications={followUps}
              onComplete={(id) =>
                persistApplications(
                  applications.map((application) =>
                    application.id === id ? { ...application, followUpDate: null } : application,
                  ),
                )
              }
            />
          ) : null}

          {view === "settings" ? (
            <SettingsView
              applicationCount={applications.length}
              isDarkMode={isDarkMode}
              onReset={() => {
                if (window.confirm("Reset your application list to the sample dashboard?")) {
                    resetToSamples();
                }
              }}
              onToggleTheme={toggleTheme}
            />
          ) : null}

          <footer className="page-footer">
            <span>Made for your next chapter.</span>
            <span>ApplyTrack · 2026</span>
          </footer>
        </div>
      </main>
      {isDialogOpen ? (
        <AddApplicationDialog onClose={() => setIsDialogOpen(false)} onSave={addApplication} />
      ) : null}
    </div>
  );
}

function ApplicationSection({
  title,
  applications,
  filter,
  search,
  totalCount,
  sortDirection,
  isLoading,
  onSearch,
  onFilter,
  onToggleSort,
  onDelete,
  onShowAll,
}: {
  title: string;
  applications: Application[];
  filter: string;
  search: string;
  totalCount: number;
  sortDirection: "asc" | "desc";
  isLoading: boolean;
  onSearch: (value: string) => void;
  onFilter: (value: string) => void;
  onToggleSort: () => void;
  onDelete: (id: string) => void;
  onShowAll?: () => void;
}) {
  return (
    <section className="panel applications-panel">
      <div className="panel-heading applications-heading">
        <div>
          <h2>{title}</h2>
          <p>
            {isLoading
              ? "Loading your applications…"
              : `${applications.length}${title === "Recent applications" && totalCount > 5 ? ` of ${totalCount}` : ""} application${applications.length === 1 ? "" : "s"}`}
          </p>
        </div>
        {onShowAll ? (
          <button className="text-link show-all-link" onClick={onShowAll} type="button">
            View all <ArrowRight size={14} />
          </button>
        ) : null}
      </div>
      <div className="table-toolbar">
        <label className="search-control">
          <Search size={16} />
          <input
            aria-label="Search company or job title"
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search company or role..."
            value={search}
          />
          {search ? (
            <button aria-label="Clear search" onClick={() => onSearch("")} type="button">
              <X size={14} />
            </button>
          ) : null}
        </label>
        <label className="filter-control">
          <span className="filter-icon">
            <ArrowUpDown size={14} />
          </span>
          <select
            aria-label="Filter by application status"
            onChange={(event) => onFilter(event.target.value)}
            value={filter}
          >
            <option>All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
          <ChevronDown className="select-chevron" size={14} />
        </label>
      </div>
      <ApplicationTable
        applications={applications}
        isLoading={isLoading}
        onDelete={onDelete}
        onToggleSort={onToggleSort}
        sortDirection={sortDirection}
      />
      {applications.length > 0 && !isLoading ? (
        <div className="table-footer">
          <span>
            Showing <strong>{applications.length}</strong> {applications.length === 1 ? "result" : "results"}
          </span>
          <span className="table-footer-note">
            <Check size={14} /> Up to date
          </span>
        </div>
      ) : null}
    </section>
  );
}

function CompaniesView({
  applications,
  onAdd,
}: {
  applications: Application[];
  onAdd: () => void;
}) {
  const companies = useMemo(() => {
    const groups = new Map<string, Application[]>();
    for (const application of applications) {
      groups.set(application.company, [
        ...(groups.get(application.company) ?? []),
        application,
      ]);
    }
    return [...groups.entries()].sort(([first], [second]) => first.localeCompare(second));
  }, [applications]);

  return (
    <>
      <section className="page-heading">
        <div>
          <div className="eyebrow">YOUR NETWORK</div>
          <h1>Companies</h1>
          <p>Keep track of every team you’re excited to join.</p>
        </div>
        <button className="button-primary" onClick={onAdd} type="button">
          <Plus size={17} /> Add application
        </button>
      </section>
      {companies.length ? (
        <div className="company-grid">
          {companies.map(([company, companyApplications]) => (
            <article className="panel company-card" key={company}>
              <div className="company-card-heading">
                <span className={`company-mark company-mark-large mark-${company.length % 5}`}>
                  {company.slice(0, 1)}
                </span>
                <span className="company-card-count">
                  {companyApplications.length} role{companyApplications.length === 1 ? "" : "s"}
                </span>
              </div>
              <h2>{company}</h2>
              <p>{companyApplications.map((application) => application.position).join(", ")}</p>
              <div className="company-card-statuses">
                {companyApplications.map((application) => (
                  <StatusBadge key={application.id} status={application.status} />
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyPage
          description="Companies will show up here when you add an application."
          icon={Building2}
          title="No companies yet"
        />
      )}
    </>
  );
}

function FollowUpsView({
  applications,
  onComplete,
}: {
  applications: Application[];
  onComplete: (id: string) => void;
}) {
  return (
    <>
      <section className="page-heading">
        <div>
          <div className="eyebrow">STAY TOP OF MIND</div>
          <h1>Follow-ups</h1>
          <p>A thoughtful follow-up can help you stand out.</p>
        </div>
        <span className="follow-up-count">
          <CalendarHeart size={16} /> {applications.length} upcoming
        </span>
      </section>
      {applications.length ? (
        <section className="panel follow-up-panel">
          <div className="panel-heading">
            <div>
              <h2>Upcoming reminders</h2>
              <p>Make a note to check in with these teams.</p>
            </div>
          </div>
          <div className="follow-up-list">
            {applications.map((application) => (
              <article className="follow-up-item" key={application.id}>
                <span className="follow-up-date">
                  <CalendarDays size={16} />
                  {formatDate(application.followUpDate ?? "")}
                </span>
                <div className="follow-up-company">
                  <span className={`company-mark mark-${application.company.length % 5}`}>
                    {application.company.slice(0, 1)}
                  </span>
                  <div>
                    <strong>{application.company}</strong>
                    <p>{application.position}</p>
                  </div>
                </div>
                <StatusBadge status={application.status} />
                <button
                  className="button-secondary complete-button"
                  onClick={() => onComplete(application.id)}
                  type="button"
                >
                  <Check size={15} /> Mark complete
                </button>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <EmptyPage
          description="You’re all caught up. Add a follow-up reminder from your applications when you need one."
          icon={CalendarHeart}
          title="No follow-ups scheduled"
        />
      )}
    </>
  );
}

function SettingsView({
  applicationCount,
  isDarkMode,
  onToggleTheme,
  onReset,
}: {
  applicationCount: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onReset: () => void;
}) {
  return (
    <>
      <section className="page-heading">
        <div>
          <div className="eyebrow">MAKE IT YOURS</div>
          <h1>Settings</h1>
          <p>Manage your ApplyTrack preferences.</p>
        </div>
      </section>
      <section className="panel settings-panel">
        <div className="settings-section-heading">
          <h2>Appearance</h2>
          <p>Choose the look that works best for you.</p>
        </div>
        <div className="settings-row">
          <div className="settings-row-icon">
            {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
          </div>
          <div className="settings-row-copy">
            <strong>Dark mode</strong>
            <p>Give your eyes a break with a darker interface.</p>
          </div>
          <button
            aria-checked={isDarkMode}
            aria-label="Toggle dark mode"
            className={`toggle-switch${isDarkMode ? " toggle-on" : ""}`}
            onClick={onToggleTheme}
            role="switch"
            type="button"
          >
            <span />
          </button>
        </div>
        <div className="settings-section-heading data-settings-heading">
          <h2>Your data</h2>
          <p>Application records are saved in this browser.</p>
        </div>
        <div className="settings-row">
          <div className="settings-row-icon">
            <BriefcaseBusiness size={18} />
          </div>
          <div className="settings-row-copy">
            <strong>{applicationCount} applications saved</strong>
            <p>Your records stay on this device. No account or cloud sync is connected.</p>
          </div>
          <button className="button-secondary reset-button" onClick={onReset} type="button">
            Reset sample data
          </button>
        </div>
      </section>
    </>
  );
}

function EmptyPage({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <section className="panel empty-page">
      <div className="empty-icon">
        <Icon size={22} />
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
}
