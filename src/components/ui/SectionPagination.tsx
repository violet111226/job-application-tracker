"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export function SectionPagination({
  currentPage,
  pageCount,
  totalItems,
  pageSize,
  onPageChange,
}: {
  currentPage: number;
  pageCount: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  if (totalItems === 0) return null;

  const firstItem = (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div aria-label="Applications pagination" className="section-pagination">
      <span className="pagination-summary">
        Showing <strong>{firstItem}-{lastItem}</strong> of <strong>{totalItems}</strong> applications
      </span>
      {pageCount > 1 ? (
        <div className="pagination-controls">
          <button
            aria-label="Previous page"
            className="pagination-button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            type="button"
          >
            <ChevronLeft size={15} /> Previous
          </button>
          <span aria-live="polite" className="pagination-page">Page {currentPage} of {pageCount}</span>
          <button
            aria-label="Next page"
            className="pagination-button"
            disabled={currentPage === pageCount}
            onClick={() => onPageChange(currentPage + 1)}
            type="button"
          >
            Next <ChevronRight size={15} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
