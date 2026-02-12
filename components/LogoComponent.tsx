import React, { useState, useEffect } from 'react';

interface Logo {
  filename: string;
  name: string;
  url: string;
}

interface LogoComponentProps {
  logoUrl?: string;
}

const LogoComponent: React.FC<LogoComponentProps> = ({ logoUrl }) => {
  const [currentLogo, setCurrentLogo] = useState<Logo | null>({
    filename: '1.jpg',
    name: '1',
    url: 'http://localhost:5000/uploads/logos/1.jpg'
  });
  const [logoList, setLogoList] = useState<Logo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [autoChange, setAutoChange] = useState(true); // Auto-change enabled by default
  const [changeInterval, setChangeInterval] = useState(60000); // Change every 1 minute (60 seconds)
  const [logoUpdateKey, setLogoUpdateKey] = useState(0); // Force re-render

  useEffect(() => {
    if (logoUrl) {
      // Use provided logo URL
      setCurrentLogo({
        filename: logoUrl.split('/').pop() || 'logo',
        name: logoUrl.split('/').pop()?.split('.')[0] || 'logo',
        url: logoUrl
      });
      setIsLoading(false);
    } else {
      // Fetch random logos
      fetchLogos();
    }
  }, [logoUrl]);

  useEffect(() => {
    console.log('LogoComponent mounted, autoChange:', autoChange, 'logoList length:', logoList.length);
    if (!autoChange || logoList.length === 0) {
      console.log('Auto-change disabled or no logos available');
      return;
    }

    console.log('Setting up interval for auto-change');
    const interval = setInterval(() => {
      console.log('Interval triggered, changing logo...');
      changeLogo();
    }, changeInterval);

    return () => {
      console.log('Cleaning up interval');
      clearInterval(interval);
    };
  }, [autoChange, changeInterval, logoList]);

  // Ensure logos are fetched on mount
  useEffect(() => {
    if (logoList.length === 0 && !logoUrl) {
      console.log('No logos available, fetching...');
      fetchLogos();
    }
  }, []);

  const fetchLogos = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching logos from API...');
      // Fetch random logos to get some options
      const response = await fetch('http://localhost:5000/api/logos/random/10');
      const data = await response.json();
      
      console.log('API response:', data);
      
      if (data.logos && data.logos.length > 0) {
        setLogoList(data.logos);
        console.log('Logos loaded:', data.logos.length);
        // Set first logo as current if no current logo
        if (!currentLogo) {
          setCurrentLogo(data.logos[0]);
          console.log('Set initial logo:', data.logos[0].name);
        }
      }
    } catch (error) {
      console.error('Error fetching logos:', error);
      // Fallback to a default logo
      const fallbackLogo = {
        filename: '1.jpg',
        name: '1',
        url: 'http://localhost:5000/uploads/logos/1.jpg'
      };
      setLogoList([fallbackLogo]);
      setCurrentLogo(fallbackLogo);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLogo = () => {
    if (logoList.length > 0) {
      const randomIndex = Math.floor(Math.random() * logoList.length);
      const newLogo = logoList[randomIndex];
      setCurrentLogo(newLogo);
      setImageError(false);
      setLogoUpdateKey(prev => prev + 1); // Force re-render
      console.log(`Logo changed to: ${newLogo.name} (${newLogo.filename})`);
    }
  };

  const toggleAutoChange = () => {
    setAutoChange(prev => !prev);
  };

  const handleImageError = () => {
    console.error('Failed to load logo:', currentLogo?.url);
    setImageError(true);
    // Try to fetch a new logo
    fetchLogos();
  };

  if (isLoading) {
    return (
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gray-600 animate-pulse mr-2 flex items-center justify-center">
        <span className="text-white text-xs">Loading...</span>
      </div>
    );
  }

  if (!currentLogo || imageError) {
    return (
      <div 
        className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 mr-2 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
        onClick={changeLogo}
        title="Click to load logo"
      >
        <span className="text-white font-bold text-xs">AB</span>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <div className="relative">
        <img 
          key={logoUpdateKey} // Force re-render when logo changes
          src={currentLogo.url} 
          alt="AmazeBid Logo" 
          className="w-8 h-8 md:w-10 md:h-10 rounded-lg object-cover mr-2 hover:opacity-80 transition-opacity"
          onError={handleImageError}
          title={`Auto-change: ${autoChange ? 'ON (1m)' : 'OFF'}`}
        />
        {/* Auto-change indicator - hidden */}
        {/* {autoChange && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Auto-change enabled (1m)" />
        )} */}
        {/* Logo name display for debugging - hidden */}
        {/* <div className="absolute -bottom-6 left-0 text-xs text-white bg-black bg-opacity-75 px-1 rounded">
          {currentLogo?.name || 'Loading...'}
        </div> */}
      </div>
    </div>
  );
};

export default LogoComponent;
