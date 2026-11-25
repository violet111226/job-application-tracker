"use client";

import { Trash2, X } from "lucide-react";

export function ConfirmDialog({
  title,
  description,
  onCancel,
  onConfirm,
}: {
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <section aria-modal="true" role="dialog" className="confirm-panel">
        <button aria-label="Close" className="icon-button confirm-close" onClick={onCancel}><X size={18} /></button>
        <span className="confirm-icon"><Trash2 size={20} /></span>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="dialog-actions">
          <button className="button-secondary" onClick={onCancel}>Cancel</button>
          <button className="button-danger" onClick={onConfirm}>Delete application</button>
        </div>
      </section>
    </div>
  );
}
