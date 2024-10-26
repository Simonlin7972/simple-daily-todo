import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslation } from 'react-i18next';

export function TimerButton() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="text-2xl font-bold">
          {formatTime(time)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 mb-1" align="start" side="top">
        <div className="flex flex-col space-y-2">
          <Button variant="outline" onClick={toggleTimer}>
            {isRunning ? t('pauseTimer') : t('startTimer')}
          </Button>
          <Button variant="secondary" onClick={resetTimer}>{t('resetTimer')}</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
