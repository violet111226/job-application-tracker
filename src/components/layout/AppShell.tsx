"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarHeart,
  LayoutDashboard,
  Menu,
  Moon,
  Plus,
  Settings,
  Sun,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { ApplicationStoreProvider, useApplications } from "@/lib/application-store";
import { AddApplicationDialog } from "@/features/applications/components/AddApplicationDialog";

const navigation: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: BriefcaseBusiness },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/follow-ups", label: "Follow-ups", icon: CalendarHeart },
  { href: "/settings", label: "Settings", icon: Settings },
];

function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { applications, saveApplication } = useApplications();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() =>
    typeof window !== "undefined"
      ? window.localStorage.getItem("applytrack.theme") === "dark"
      : false,
  );

  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", darkMode);
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((current) => {
      const next = !current;
      window.localStorage.setItem("applytrack.theme", next ? "dark" : "light");
      return next;
    });
  };

  const followUps = applications.filter((application) => Boolean(application.followUpDate)).length;

  return (
    <div className={`dashboard-root min-h-screen${darkMode ? " theme-dark" : ""}`}>
      {mobileOpen ? (
        <button aria-label="Close navigation" className="sidebar-backdrop" onClick={() => setMobileOpen(false)} />
      ) : null}
      <aside className={`sidebar${mobileOpen ? " sidebar-open" : ""}`}>
        <div className="brand-lockup">
          <span className="brand-symbol"><BriefcaseBusiness size={18} /></span>
          <span className="brand-name">ApplyTrack</span>
          <button aria-label="Close navigation" className="icon-button mobile-close" onClick={() => setMobileOpen(false)}>
            <X size={18} />
          </button>
        </div>
        <nav aria-label="Main navigation" className="sidebar-navigation">
          <p className="nav-section-label">WORKSPACE</p>
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link aria-current={active ? "page" : undefined} className={`nav-link${active ? " nav-link-active" : ""}`} href={href} key={href} onClick={() => setMobileOpen(false)}>
                <Icon size={17} />
                <span>{label}</span>
                {href === "/follow-ups" && followUps > 0 ? <span className="nav-count">{followUps}</span> : null}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="tip-icon"><CalendarHeart size={17} /></span>
            <div><strong>Make every follow-up count</strong><p>A little consistency goes a long way.</p></div>
          </div>
          <Link className="profile-button" href="/settings">
            <span className="profile-avatar">AT</span>
            <span className="profile-copy"><strong>My workspace</strong><small>Personal account</small></span>
          </Link>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button aria-label="Open navigation" className="icon-button mobile-menu" onClick={() => setMobileOpen(true)}><Menu size={19} /></button>
          </div>
          <div className="topbar-actions">
            <button aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"} className="icon-button topbar-icon" onClick={toggleTheme}>
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <Link aria-label="View follow-ups" className="icon-button topbar-icon" href="/follow-ups"><Bell size={17} />{followUps > 0 ? <span className="notification-dot" /> : null}</Link>
            <span className="topbar-divider" />
            <span className="topbar-avatar">AT</span>
          </div>
        </header>
        <div className="page-content">{children}</div>
        <button className="mobile-add" aria-label="Add application" onClick={() => setDialogOpen(true)}><Plus size={20} /></button>
      </main>
      {dialogOpen ? (
        <AddApplicationDialog onClose={() => setDialogOpen(false)} onSave={(application) => {
          saveApplication(application);
          setDialogOpen(false);
        }} />
      ) : null}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <ApplicationStoreProvider>
      <Shell>{children}</Shell>
    </ApplicationStoreProvider>
  );
}
