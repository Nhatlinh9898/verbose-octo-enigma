import React, { useState, useEffect } from 'react';
import { RefreshCw, Image as ImageIcon } from 'lucide-react';

interface Logo {
  filename: string;
  name: string;
  url: string;
  size: string;
}

interface LogoSelectorProps {
  selectedLogo: string;
  onLogoSelect: (logoUrl: string) => void;
}

const LogoSelector: React.FC<LogoSelectorProps> = ({ selectedLogo, onLogoSelect }) => {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const logosPerPage = 12;

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/logos');
      const data = await response.json();
      
      if (data.logos) {
        setLogos(data.logos);
      }
    } catch (error) {
      console.error('Error fetching logos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRandomLogos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/logos/random/12');
      const data = await response.json();
      
      if (data.logos) {
        setLogos(data.logos);
        setCurrentPage(0);
      }
    } catch (error) {
      console.error('Error fetching random logos:', error);
    }
  };

  const searchLogos = async (pattern: string) => {
    if (!pattern.trim()) {
      fetchLogos();
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/logos/search/${pattern}`);
      const data = await response.json();
      
      if (data.logos) {
        setLogos(data.logos);
        setCurrentPage(0);
      }
    } catch (error) {
      console.error('Error searching logos:', error);
    }
  };

  const indexOfLastLogo = (currentPage + 1) * logosPerPage;
  const indexOfFirstLogo = indexOfLastLogo - logosPerPage;
  const currentLogos = logos.slice(indexOfFirstLogo, indexOfLastLogo);
  const totalPages = Math.ceil(logos.length / logosPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber - 1);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Logo Selection</h3>
        <div className="grid grid-cols-4 gap-2">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Logo Selection</h3>
        <button
          onClick={fetchRandomLogos}
          className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
        >
          <RefreshCw size={14} />
          Random
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search logos..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => searchLogos(e.target.value)}
        />
      </div>

      {/* Logo Grid */}
      {logos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <ImageIcon size={48} className="mx-auto mb-2" />
          <p>No logos found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
            {currentLogos.map((logo) => (
              <div
                key={logo.filename}
                className={`relative aspect-square border-2 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                  selectedLogo === logo.url
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => onLogoSelect(logo.url)}
              >
                <img
                  src={logo.url}
                  alt={logo.name}
                  className="w-full h-full object-cover rounded-md"
                />
                {selectedLogo === logo.url && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-md">
                  {logo.name}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => paginate(currentPage)}
                disabled={currentPage === 0}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1">
                {currentPage + 1} / {totalPages}
              </span>
              <button
                onClick={() => paginate(currentPage + 2)}
                disabled={currentPage === totalPages - 1}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}

          <div className="text-sm text-gray-600 text-center">
            {logos.length} logos available
          </div>
        </>
      )}
    </div>
  );
};

export default LogoSelector;
