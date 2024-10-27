import React, { useEffect } from 'react';
import { RecapCard } from './RecapCard';
import useLocalStorage from '../hooks/useLocalStorage';
import { SharedTabs } from './SharedTabs';
import { useFont } from '../contexts/FontContext';

interface RecapData {
  text: string;
  mood: string;
  date: string;
}

export const DailyReview: React.FC = () => {
  const [recaps, setRecaps] = useLocalStorage<RecapData[]>('dailyRecaps', []) as [
    RecapData[],
    React.Dispatch<React.SetStateAction<RecapData[]>>
  ];
  const { font } = useFont();

  useEffect(() => {
    const savedRecap = localStorage.getItem('dailyRecap');
    if (savedRecap) {
      const parsedRecap = JSON.parse(savedRecap) as RecapData;
      setRecaps((prevRecaps: RecapData[]) => [{...parsedRecap, date: new Date().toISOString()}, ...prevRecaps]);
      localStorage.removeItem('dailyRecap');
    }
  }, []);

  const handleSaveRecap = (updatedRecap: RecapData): void => {
    setRecaps((prevRecaps: RecapData[]) => prevRecaps.map(recap => 
      recap.date === updatedRecap.date ? updatedRecap : recap
    ));
  };

  const handleDeleteRecap = (date: string): void => {
    setRecaps((prevRecaps: RecapData[]) => prevRecaps.filter(recap => recap.date !== date));
  };

  return (
    <div className={`font-${font} container mx-auto px-4 py-4`}>
      <SharedTabs />
      {recaps.map((recap: RecapData) => (
        <RecapCard 
          key={recap.date} 
          recap={recap} 
          onSave={handleSaveRecap} 
          onDelete={handleDeleteRecap}
        />
      ))}
    </div>
  );
};
