import React, { createContext, useState, useContext, useEffect } from 'react';

type Font = 'inter' | 'roboto' | 'open-sans' | 'lato' | 'poppins';

interface FontContextType {
  font: Font;
  setFont: (font: Font) => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [font, setFont] = useState<Font>('inter');

  useEffect(() => {
    document.documentElement.className = document.documentElement.className
      .replace(/font-(inter|roboto|open-sans|lato|poppins)/, '')
      .trim();
    document.documentElement.classList.add(`font-${font}`);
  }, [font]);

  return (
    <FontContext.Provider value={{ font, setFont }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFont = () => {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
};
