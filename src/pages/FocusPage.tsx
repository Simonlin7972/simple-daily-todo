import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, Check, Play, Pause, RotateCcw } from "lucide-react";
import { useTranslation } from 'react-i18next';

export const FocusPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [currentTask, setCurrentTask] = useState<string>('');

  useEffect(() => {
    const handleTimerUpdate = (event: CustomEvent<{ taskText: string; time: number; isRunning: boolean }>) => {
      if (event.detail.taskText) {
        setCurrentTask(event.detail.taskText);
        setIsRunning(event.detail.isRunning);
        setTime(event.detail.time);
      }
    };

    window.addEventListener('timerUpdate', handleTimerUpdate as EventListener);

    return () => {
      window.removeEventListener('timerUpdate', handleTimerUpdate as EventListener);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    window.dispatchEvent(new CustomEvent('toggleTimer', { detail: { taskText: currentTask } }));
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
    setCurrentTask('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-center mt-24">
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center mb-12">
          <span className="text-lg mb-4 text-muted-foreground">進行中任務</span>
          <span className="text-3xl">{currentTask}</span>
        </div>
        {/* 圓形計時器 */}
        <div className="w-96 h-96 rounded-full border-2 bg-muted border-primary flex flex-col items-center justify-center mb-12">
          <span className="text-7xl font-mono mb-6">{formatTime(time)}</span>
          
          {/* 計時器控制按鈕 */}
          <div className="flex space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTimer}
              className={`w-16 h-16 rounded-full ${isRunning ? 'text-yellow-500' : 'text-green-500'}`}
            >
              {isRunning ? <Pause size={24} /> : <Play size={24} />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={resetTimer}
              disabled={time === 0}
              className="w-16 h-16 rounded-full"
            >
              <RotateCcw size={24} />
            </Button>
          </div>
        </div>

        {/* 底部按鈕 */}
        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => navigate('/')}
            className="w-40"
          >
            <Home className="mr-2 h-4" />
            {t('home')}
          </Button>
          <Button 
            size="lg"
            onClick={() => {
              // TODO: 處理完成任務邏輯
              navigate('/');
            }}
            className="w-40"
          >
            <Check className="mr-2 h-4" />
            {t('complete')}
          </Button>
        </div>
      </div>
    </div>
  );
}; 