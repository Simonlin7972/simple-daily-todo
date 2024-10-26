import React, { useEffect } from 'react';
import { RecapCard } from './RecapCard';
import useLocalStorage from '../hooks/useLocalStorage';

interface RecapData {
  text: string;
  mood: string;
}

export const DailyReview: React.FC = () => {
  const [recap, setRecap] = useLocalStorage<RecapData>('dailyRecap', { text: '', mood: '' });

  useEffect(() => {
    const savedRecap = localStorage.getItem('dailyRecap');
    if (savedRecap) {
      setRecap(JSON.parse(savedRecap));
    }
  }, []);

  const handleSaveRecap = (updatedRecap: RecapData) => {
    setRecap(updatedRecap);
    localStorage.setItem('dailyRecap', JSON.stringify(updatedRecap));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {recap && <RecapCard recap={recap} onSave={handleSaveRecap} />}
    </div>
  );
};
