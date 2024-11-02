import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  currentPage: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ currentPage }) => {
  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)] dark:text-[var(--secondary-foreground)] dark:hover:text-white">
            Home
          </Link>
        </li>
        <li>
          <div className="flex items-center">
            <ChevronRight className="w-4 h-4 text-[var(--muted)]" />
            <Link to="/profile" className="ml-1 text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)] dark:text-[var(--secondary-foreground)] dark:hover:text-white">
              Profile
            </Link>
          </div>
        </li>
        <li>
          <div className="flex items-center">
            <ChevronRight className="w-4 h-4 text-[var(--muted)]" />
            <span className="ml-1 text-sm font-medium text-[var(--muted-foreground)] md:ml-2 dark:text-[var(--secondary-foreground)]">
              {currentPage}
            </span>
          </div>
        </li>
      </ol>
    </nav>
  );
};
