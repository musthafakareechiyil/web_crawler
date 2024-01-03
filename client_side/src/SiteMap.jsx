import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Separate component for displaying a single crawled page
function CrawledPage({ page }) {
  const [showDependencies, setShowDependencies] = useState(false);

  const handleToggleDependencies = () => {
    setShowDependencies(!showDependencies);
  };

  return (
    <li className='p-3 border cursor-pointer'>
      <div className="flex items-center">
        <strong onClick={handleToggleDependencies} style={{ cursor: 'pointer' }}>
          <h1>{page.title}</h1>
        </strong>
        <button onClick={handleToggleDependencies} className="m-2">
          {showDependencies ? (
            <span className="text-blue-500">&#9650;</span>
          ) : (
            <span className="text-">&#9660;</span>
          )}
        </button>
        <a href={page.url} target="_blank" rel="noopener noreferrer" className='hover:text-blue-700'>
          {page.url}
        </a>

      </div>

      {showDependencies && (
        <ul className="list-disc pl-6">
          {page.dependencies.map((dependency, index) => (
            <li key={index} className='p-2'>
              <a
                href={dependency}
                target="_blank"
                rel="noopener noreferrer"
                className='hover:text-blue-700'
              >
                {dependency}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
function SiteMap() {
  const location = useLocation();
  const crawledPages = location.state?.crawledPages;
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-8 bg-neutral-300">
      <h1 className="text-4xl font-bold mb-4">Crawled Site Map</h1>

      {crawledPages.length === 0 ? (
        <p>No pages crawled.</p>
      ) : (
        <ul className="list-disc pl-6">
          {crawledPages.map((page, index) => (
            <CrawledPage key={index} page={page} />
          ))}
        </ul>
      )}

      <div className="mt-8">
        <button
          className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
          onClick={() => navigate("/", { state: { fromSiteMap: true } })}
        >
          Try Another URL
        </button>
      </div>
    </div>
  );
}

export default SiteMap;
