"use client";

import { Plus, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { APPLICATION_STATUSES } from "@/lib/application-store";
import type { Application, ApplicationStatus, WorkArrangement } from "@/types/application";

export function AddApplicationDialog({
  application,
  onClose,
  onSave,
  onView,
}: {
  application?: Application;
  onClose: () => void;
  onSave: (application: Application) => void;
  onView?: boolean;
}) {
  const [status, setStatus] = useState<ApplicationStatus>(application?.status ?? "Applied");
  const [workArrangement, setWorkArrangement] = useState<WorkArrangement>(application?.workArrangement ?? "Hybrid");
  const readOnly = Boolean(onView);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (readOnly) return;
    const data = new FormData(event.currentTarget);
    const number = (name: string) => {
      const value = String(data.get(name) ?? "").trim();
      return value ? Number(value) : null;
    };
    onSave({
      id: application?.id ?? crypto.randomUUID(),
      company: String(data.get("company")).trim(),
      companyWebsite: String(data.get("companyWebsite")).trim(),
      industry: String(data.get("industry")).trim(),
      position: String(data.get("position")).trim(),
      postingUrl: String(data.get("postingUrl")).trim(),
      applicationDate: String(data.get("applicationDate")),
      status,
      salaryMin: number("salaryMin"),
      salaryMax: number("salaryMax"),
      currency: String(data.get("currency")).trim() || "PHP",
      streetAddress: String(data.get("streetAddress")).trim(),
      city: String(data.get("city")).trim(),
      province: String(data.get("province")).trim(),
      country: String(data.get("country")).trim(),
      workArrangement,
      recruiter: String(data.get("recruiter")).trim(),
      contactEmail: String(data.get("contactEmail")).trim(),
      researchLinks: String(data.get("researchLinks")).trim(),
      interviewNotes: String(data.get("interviewNotes")).trim(),
      additionalRemarks: String(data.get("additionalRemarks")).trim(),
      notes: String(data.get("notes")).trim(),
      followUpDate: String(data.get("followUpDate") || "") || null,
    });
  }

  const fields = [
    ["company", "Company name", "e.g. Acme Inc.", true],
    ["companyWebsite", "Company website", "https://company.com", false],
    ["industry", "Industry", "e.g. Software", false],
  ] as const;

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section aria-labelledby="application-dialog-title" aria-modal="true" role="dialog" className="dialog-panel application-dialog">
        <div className="dialog-header">
          <div>
            <span className="eyebrow">{readOnly ? "APPLICATION DETAILS" : application ? "UPDATE YOUR SEARCH" : "KEEP YOUR SEARCH ON TRACK"}</span>
            <h2 id="application-dialog-title">{readOnly ? application?.company : application ? "Edit application" : "Add an application"}</h2>
          </div>
          <button aria-label="Close dialog" className="icon-button" onClick={onClose}><X size={18} /></button>
        </div>
        <form className="application-form" onSubmit={handleSubmit}>
          <div className="application-form-body">
            <fieldset disabled={readOnly}>
              <section className="form-section">
                <h3>Company information</h3>
                <div className="form-grid form-grid-three">
                  {fields.map(([name, label, placeholder, required]) => (
                    <label className="form-field" key={name}>
                      <span className="field-label">{label}{required ? <span className="required-mark">*</span> : null}</span>
                      <input className="control" name={name} defaultValue={application?.[name] ?? ""} placeholder={placeholder} required={required} />
                    </label>
                  ))}
                </div>
              </section>

              <section className="form-section">
                <h3>Job information</h3>
                <div className="form-grid form-grid-two">
                  <label className="form-field"><span className="field-label">Position applied for<span className="required-mark">*</span></span><input className="control" name="position" defaultValue={application?.position ?? ""} required /></label>
                  <label className="form-field"><span className="field-label">Job posting URL</span><input className="control" name="postingUrl" defaultValue={application?.postingUrl ?? ""} type="url" /></label>
                  <label className="form-field"><span className="field-label">Application date<span className="required-mark">*</span></span><input className="control" name="applicationDate" defaultValue={application?.applicationDate ?? new Date().toISOString().slice(0, 10)} required type="date" /></label>
                  <label className="form-field"><span className="field-label">Application status</span><select className="control" value={status} onChange={(event) => setStatus(event.target.value as ApplicationStatus)}>
                    {APPLICATION_STATUSES.map((item) => <option key={item}>{item}</option>)}
                  </select></label>
                </div>
              </section>

              <section className="form-section">
                <h3>Salary information</h3>
                <div className="form-grid form-grid-three">
                  <label className="form-field"><span className="field-label">Minimum salary</span><input className="control" name="salaryMin" defaultValue={application?.salaryMin ?? ""} min="0" type="number" /></label>
                  <label className="form-field"><span className="field-label">Maximum salary</span><input className="control" name="salaryMax" defaultValue={application?.salaryMax ?? ""} min="0" type="number" /></label>
                  <label className="form-field"><span className="field-label">Currency</span><select className="control" name="currency" defaultValue={application?.currency ?? "PHP"}><option>PHP</option><option>USD</option><option>SGD</option><option>EUR</option></select></label>
                </div>
              </section>

              <section className="form-section">
                <h3>Location information</h3>
                <div className="form-grid form-grid-three">
                  <label className="form-field"><span className="field-label">Street address</span><input className="control" name="streetAddress" defaultValue={application?.streetAddress ?? ""} /></label>
                  <label className="form-field"><span className="field-label">City</span><input className="control" name="city" defaultValue={application?.city ?? ""} /></label>
                  <label className="form-field"><span className="field-label">Province</span><input className="control" name="province" defaultValue={application?.province ?? ""} /></label>
                  <label className="form-field"><span className="field-label">Country</span><input className="control" name="country" defaultValue={application?.country ?? ""} /></label>
                  <label className="form-field"><span className="field-label">Work arrangement</span><select className="control" value={workArrangement} onChange={(event) => setWorkArrangement(event.target.value as WorkArrangement)}><option>On-site</option><option>Hybrid</option><option>Remote</option></select></label>
                </div>
              </section>

              <section className="form-section">
                <h3>Contact information</h3>
                <div className="form-grid form-grid-two">
                  <label className="form-field"><span className="field-label">Recruiter / Contact person</span><input className="control" name="recruiter" defaultValue={application?.recruiter ?? ""} /></label>
                  <label className="form-field"><span className="field-label">Contact email</span><input className="control" name="contactEmail" defaultValue={application?.contactEmail ?? ""} type="email" /></label>
                </div>
              </section>

              <section className="form-section">
                <h3>Company reviews and research links</h3>
                <div className="form-grid form-grid-full">
                  <label className="form-field"><span className="field-label">Research links</span><textarea className="control textarea" name="researchLinks" defaultValue={application?.researchLinks ?? ""} placeholder="Paste company reviews or research links" /></label>
                </div>
              </section>

              <section className="form-section">
                <h3>Personal notes</h3>
                <div className="form-grid form-grid-two">
                  <label className="form-field"><span className="field-label">Interview notes</span><textarea className="control textarea" name="interviewNotes" defaultValue={application?.interviewNotes ?? application?.notes ?? ""} /></label>
                  <label className="form-field"><span className="field-label">Additional remarks</span><textarea className="control textarea" name="additionalRemarks" defaultValue={application?.additionalRemarks ?? ""} /></label>
                  <label className="form-field"><span className="field-label">Personal notes</span><textarea className="control textarea" name="notes" defaultValue={application?.notes ?? ""} /></label>
                  <label className="form-field"><span className="field-label">Follow-up date</span><input className="control" name="followUpDate" defaultValue={application?.followUpDate ?? ""} type="date" /></label>
                </div>
              </section>
            </fieldset>
          </div>
          <div className="dialog-actions modal-footer">
            {readOnly ? (
              <button className="button-primary" onClick={onClose} type="button">Close</button>
            ) : (
              <>
                <button className="button-secondary" onClick={onClose} type="button">Cancel</button>
                <button className="button-primary" type="submit"><Plus size={16} />{application ? "Save changes" : "Save application"}</button>
              </>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
