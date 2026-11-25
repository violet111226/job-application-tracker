export type ApplicationStatus =
  | "Applied"
  | "Assessment"
  | "Interview"
  | "Job Offer"
  | "Rejected"
  | "Withdrawn";

export type WorkArrangement = "On-site" | "Hybrid" | "Remote";

export type Application = {
  id: string;
  company: string;
  companyWebsite: string;
  industry: string;
  position: string;
  postingUrl: string;
  applicationDate: string;
  status: ApplicationStatus;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  streetAddress: string;
  city: string;
  province: string;
  country: string;
  workArrangement: WorkArrangement;
  recruiter: string;
  contactEmail: string;
  researchLinks: string;
  interviewNotes: string;
  additionalRemarks: string;
  notes: string;
  followUpDate: string | null;
};
