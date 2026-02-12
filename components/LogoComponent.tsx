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
  const [currentLogo, setCurrentLogo] = useState<Logo | null>(null);
  const [logoList, setLogoList] = useState<Logo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const fetchLogos = async () => {
    try {
      // Fetch random logos to get some options
      const response = await fetch('http://localhost:5000/api/logos/random/10');
      const data = await response.json();
      
      if (data.logos && data.logos.length > 0) {
        setLogoList(data.logos);
        // Set first logo as current
        setCurrentLogo(data.logos[0]);
      }
    } catch (error) {
      console.error('Error fetching logos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLogo = () => {
    if (logoList.length > 0) {
      const randomIndex = Math.floor(Math.random() * logoList.length);
      setCurrentLogo(logoList[randomIndex]);
    }
  };

  if (isLoading) {
    return (
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gray-600 animate-pulse mr-2" />
    );
  }

  if (!currentLogo) {
    return (
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gray-600 mr-2 flex items-center justify-center">
        <span className="text-white text-xs">No Logo</span>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <img 
        src={currentLogo.url} 
        alt="AmazeBid Logo" 
        className="w-8 h-8 md:w-10 md:h-10 rounded-lg object-cover mr-2 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={changeLogo}
        title="Click to change logo"
      />
    </div>
  );
};

export default LogoComponent;
