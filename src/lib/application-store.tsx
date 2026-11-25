"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Application } from "@/types/application";

const STORAGE_KEY = "applytrack.applications";
export const APPLICATION_STATUSES: Application["status"][] = [
  "Applied",
  "Assessment",
  "Interview",
  "Job Offer",
  "Rejected",
  "Withdrawn",
];

export const sampleApplications: Application[] = [
  {
    id: "sample-1",
    company: "Linear",
    companyWebsite: "https://linear.app",
    industry: "Software",
    position: "Product Designer",
    postingUrl: "https://linear.app/careers",
    applicationDate: "2026-11-21",
    status: "Interview",
    salaryMin: 145000,
    salaryMax: 175000,
    currency: "USD",
    streetAddress: "",
    city: "San Francisco",
    province: "CA",
    country: "United States",
    workArrangement: "Remote",
    recruiter: "",
    contactEmail: "",
    researchLinks: "",
    interviewNotes: "",
    additionalRemarks: "",
    notes: "Prepare portfolio walkthrough.",
    followUpDate: "2026-11-27",
  },
  {
    id: "sample-2",
    company: "Vercel",
    companyWebsite: "https://vercel.com",
    industry: "Developer Tools",
    position: "Frontend Engineer",
    postingUrl: "https://vercel.com/careers",
    applicationDate: "2026-11-19",
    status: "Applied",
    salaryMin: 160000,
    salaryMax: 195000,
    currency: "USD",
    streetAddress: "",
    city: "Remote",
    province: "",
    country: "United States",
    workArrangement: "Remote",
    recruiter: "",
    contactEmail: "",
    researchLinks: "",
    interviewNotes: "",
    additionalRemarks: "",
    notes: "",
    followUpDate: "2026-11-26",
  },
  {
    id: "sample-3",
    company: "Figma",
    companyWebsite: "https://figma.com",
    industry: "Design Software",
    position: "Product Designer",
    postingUrl: "https://figma.com/careers",
    applicationDate: "2026-11-17",
    status: "Assessment",
    salaryMin: 150000,
    salaryMax: 185000,
    currency: "USD",
    streetAddress: "",
    city: "New York",
    province: "NY",
    country: "United States",
    workArrangement: "Hybrid",
    recruiter: "",
    contactEmail: "",
    researchLinks: "",
    interviewNotes: "",
    additionalRemarks: "",
    notes: "Complete the product critique.",
    followUpDate: null,
  },
  {
    id: "sample-4",
    company: "Notion",
    companyWebsite: "https://notion.so",
    industry: "Collaboration",
    position: "Product Manager",
    postingUrl: "https://notion.so/careers",
    applicationDate: "2026-11-14",
    status: "Interview",
    salaryMin: 155000,
    salaryMax: 190000,
    currency: "USD",
    streetAddress: "",
    city: "San Francisco",
    province: "CA",
    country: "United States",
    workArrangement: "Hybrid",
    recruiter: "",
    contactEmail: "",
    researchLinks: "",
    interviewNotes: "",
    additionalRemarks: "",
    notes: "",
    followUpDate: "2026-11-25",
  },
  {
    id: "sample-5",
    company: "Stripe",
    companyWebsite: "https://stripe.com",
    industry: "Fintech",
    position: "Software Engineer",
    postingUrl: "https://stripe.com/jobs",
    applicationDate: "2026-11-12",
    status: "Job Offer",
    salaryMin: 170000,
    salaryMax: 210000,
    currency: "USD",
    streetAddress: "",
    city: "Remote",
    province: "",
    country: "United States",
    workArrangement: "Remote",
    recruiter: "",
    contactEmail: "",
    researchLinks: "",
    interviewNotes: "",
    additionalRemarks: "",
    notes: "Review benefits and compensation.",
    followUpDate: null,
  },
  {
    id: "sample-6",
    company: "Ramp",
    companyWebsite: "https://ramp.com",
    industry: "Fintech",
    position: "UX Researcher",
    postingUrl: "https://ramp.com/careers",
    applicationDate: "2026-11-09",
    status: "Applied",
    salaryMin: 130000,
    salaryMax: 160000,
    currency: "USD",
    streetAddress: "",
    city: "New York",
    province: "NY",
    country: "United States",
    workArrangement: "On-site",
    recruiter: "",
    contactEmail: "",
    researchLinks: "",
    interviewNotes: "",
    additionalRemarks: "",
    notes: "",
    followUpDate: "2026-11-28",
  },
  {
    id: "sample-7",
    company: "Webflow",
    companyWebsite: "https://webflow.com",
    industry: "Design Software",
    position: "Product Designer",
    postingUrl: "https://webflow.com/careers",
    applicationDate: "2026-11-05",
    status: "Rejected",
    salaryMin: 135000,
    salaryMax: 165000,
    currency: "USD",
    streetAddress: "",
    city: "Remote",
    province: "",
    country: "United States",
    workArrangement: "Remote",
    recruiter: "",
    contactEmail: "",
    researchLinks: "",
    interviewNotes: "",
    additionalRemarks: "",
    notes: "",
    followUpDate: null,
  },
];

type ApplicationStore = {
  applications: Application[];
  isLoaded: boolean;
  usingSamples: boolean;
  saveApplication: (application: Application) => void;
  deleteApplication: (id: string) => void;
  resetSamples: () => void;
  clearFollowUp: (id: string) => void;
};

const StoreContext = createContext<ApplicationStore | null>(null);

export function ApplicationStoreProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>(sampleApplications);
  const [isLoaded, setIsLoaded] = useState(false);
  const [usingSamples, setUsingSamples] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as Application[];
          if (Array.isArray(parsed)) {
            setApplications(parsed);
            setUsingSamples(false);
          }
        }
      } catch {
        setApplications(sampleApplications);
      } finally {
        setIsLoaded(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const persist = useCallback((next: Application[]) => {
    setApplications(next);
    setUsingSamples(false);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const saveApplication = useCallback(
    (application: Application) => {
      const exists = applications.some((item) => item.id === application.id);
      persist(exists
        ? applications.map((item) => (item.id === application.id ? application : item))
        : [application, ...applications]);
    },
    [applications, persist],
  );

  const deleteApplication = useCallback(
    (id: string) => persist(applications.filter((application) => application.id !== id)),
    [applications, persist],
  );

  const resetSamples = useCallback(() => {
    persist(sampleApplications);
  }, [persist]);

  const clearFollowUp = useCallback(
    (id: string) =>
      persist(applications.map((application) =>
        application.id === id ? { ...application, followUpDate: null } : application,
      )),
    [applications, persist],
  );

  const value = useMemo(
    () => ({ applications, isLoaded, usingSamples, saveApplication, deleteApplication, resetSamples, clearFollowUp }),
    [applications, isLoaded, usingSamples, saveApplication, deleteApplication, resetSamples, clearFollowUp],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useApplications() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useApplications must be used within ApplicationStoreProvider");
  return context;
}
