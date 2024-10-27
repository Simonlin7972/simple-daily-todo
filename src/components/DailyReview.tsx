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
  const [recaps, setRecaps] = useLocalStorage<RecapData[]>('dailyRecaps', []);
  const { font } = useFont();

  useEffect(() => {
    const savedRecap = localStorage.getItem('dailyRecap');
    if (savedRecap) {
      const parsedRecap = JSON.parse(savedRecap);
      setRecaps(prevRecaps => [{...parsedRecap, date: new Date().toISOString()}, ...prevRecaps]);
      localStorage.removeItem('dailyRecap');
    }
  }, []);

  const handleSaveRecap = (updatedRecap: RecapData) => {
    setRecaps(prevRecaps => prevRecaps.map(recap => 
      recap.date === updatedRecap.date ? updatedRecap : recap
    ));
  };

  const handleDeleteRecap = (date: string) => {
    setRecaps(prevRecaps => prevRecaps.filter(recap => recap.date !== date));
  };

  return (
    <div className={`font-${font} container mx-auto px-4 py-4`}>
      <SharedTabs />
      {recaps.map((recap, index) => (
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
