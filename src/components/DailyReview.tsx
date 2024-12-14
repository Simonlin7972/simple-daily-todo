import React, { useEffect } from 'react';
import { RecapCard } from './RecapCard';
import useLocalStorage from '../hooks/useLocalStorage';
import { SharedTabs } from './SharedTabs';
import { useFont } from '../contexts/FontContext';
import { BookOpenText } from 'lucide-react';
import { cn } from "@/lib/utils";

interface RecapData {
  text: string;
  mood: string;
  date: string;
}

function EmptyState() {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[400px] rounded-lg",
      "border border-dashed border-border",
      "bg-muted/50 p-8 text-center"
    )}>
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <BookOpenText className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">
        目前沒有每日回顧
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        開始記錄你的每日心得和感受吧！
      </p>
    </div>
  );
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
    <div className={`font-${font} container max-w-2xl mx-auto px-4 py-4`}>
      <SharedTabs />
      {recaps.length === 0 ? (
        <EmptyState />
      ) : (
        recaps.map((recap: RecapData) => (
          <RecapCard 
            key={recap.date} 
            recap={recap} 
            onSave={handleSaveRecap} 
            onDelete={handleDeleteRecap}
          />
        ))
      )}
    </div>
  );
};
