"use client";

import { BriefcaseBusiness, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useApplications } from "@/lib/application-store";

export default function SettingsPage() {
  const { applications, resetSamples } = useApplications();
  const [darkMode, setDarkMode] = useState(() =>
    typeof window !== "undefined"
      ? window.localStorage.getItem("applytrack.theme") === "dark"
      : false,
  );

  const toggle = () => {
    setDarkMode((current) => {
      const next = !current;
      window.localStorage.setItem("applytrack.theme", next ? "dark" : "light");
      document.documentElement.classList.toggle("theme-dark", next);
      return next;
    });
  };

  return (
    <>
      <section className="page-heading"><div><div className="eyebrow">MAKE IT YOURS</div><h1>Settings</h1><p>Manage your ApplyTrack preferences.</p></div></section>
      <section className="panel settings-panel">
        <div className="settings-section-heading"><h2>Appearance</h2><p>Choose the look that works best for you.</p></div>
        <div className="settings-row"><div className="settings-row-icon">{darkMode ? <Moon size={18} /> : <Sun size={18} />}</div><div className="settings-row-copy"><strong>Dark mode</strong><p>Give your eyes a break with a darker interface.</p></div><button aria-checked={darkMode} aria-label="Toggle dark mode" className={`toggle-switch${darkMode ? " toggle-on" : ""}`} onClick={toggle} role="switch"><span /></button></div>
        <div className="settings-section-heading data-settings-heading"><h2>Profile</h2><p>Basic account information.</p></div>
        <div className="settings-profile-grid"><label>Display name<input className="control" defaultValue="My workspace" /></label><label>Email<input className="control" defaultValue="" type="email" placeholder="you@example.com" /></label></div>
        <div className="settings-section-heading data-settings-heading"><h2>Your data</h2><p>Application records are saved in this browser.</p></div>
        <div className="settings-row"><div className="settings-row-icon"><BriefcaseBusiness size={18} /></div><div className="settings-row-copy"><strong>{applications.length} applications saved</strong><p>Your records stay on this device. No cloud sync is connected.</p></div><button className="button-secondary reset-button" onClick={() => { if (window.confirm("Reset to sample applications?")) resetSamples(); }}>Reset sample data</button></div>
      </section>
    </>
  );
}
