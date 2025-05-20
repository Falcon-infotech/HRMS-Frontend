import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: Array<{
    name: string;
    href?: string;
  }>;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title,
  description,
  actions,
  breadcrumbs
}) => {
  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex mb-3" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="inline-flex items-center">
                {index > 0 && (
                  <svg className="w-3 h-3 mx-1 text-neutral-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                )}
                {crumb.href ? (
                  <Link to={crumb.href} className="ml-1 text-sm font-medium text-neutral-500 hover:text-neutral-700">
                    {crumb.name}
                  </Link>
                ) : (
                  <span className="ml-1 text-sm font-medium text-neutral-500">
                    {crumb.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">{title}</h1>
          {description && (
            <p className="text-neutral-500 mt-1">{description}</p>
          )}
        </div>
        
        {actions && (
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;