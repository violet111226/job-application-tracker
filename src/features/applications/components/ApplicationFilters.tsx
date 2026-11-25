"use client";

import { Search, X } from "lucide-react";

export function ApplicationFilters({
  search,
  onSearch,
}: {
  search: string;
  onSearch: (value: string) => void;
}) {
  return (
    <div className="application-filter-area">
      <div className="table-toolbar">
        <label className="search-control"><Search size={16} /><input aria-label="Search company or position" placeholder="Search company or position..." value={search} onChange={(event) => onSearch(event.target.value)} />{search ? <button aria-label="Clear search" onClick={() => onSearch("")} type="button"><X size={14} /></button> : null}</label>
      </div>
    </div>
  );
}
