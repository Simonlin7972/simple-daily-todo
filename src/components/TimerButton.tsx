import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

export function TimerButton() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [currentTask, setCurrentTask] = useState<string>('');

  useEffect(() => {
    const handleStartTimer = (event: CustomEvent<{ taskText: string }>) => {
      setCurrentTask(event.detail.taskText);
      setIsRunning(true);
      setTime(0);
    };

    const handleToggleTimer = (event: CustomEvent<{ taskText: string }>) => {
      if (event.detail.taskText === currentTask) {
        setIsRunning(!isRunning);
      }
    };

    window.addEventListener('startTimer', handleStartTimer as EventListener);
    window.addEventListener('toggleTimer', handleToggleTimer as EventListener);

    return () => {
      window.removeEventListener('startTimer', handleStartTimer as EventListener);
      window.removeEventListener('toggleTimer', handleToggleTimer as EventListener);
    };
  }, [currentTask, isRunning]);

  useEffect(() => {
    // 發送狀態更新事件
    window.dispatchEvent(new CustomEvent('timerStateUpdate', { 
      detail: { 
        taskText: currentTask,
        isRunning 
      } 
    }));

    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          window.dispatchEvent(new CustomEvent('timerUpdate', { 
            detail: { 
              taskText: currentTask,
              time: prevTime + 1,
              isRunning 
            } 
          }));
          return prevTime + 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, currentTask]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
    setCurrentTask('');
    window.dispatchEvent(new CustomEvent('timerReset'));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-3">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTimer}
        className={isRunning ? 'text-yellow-500' : 'text-green-500'}
      >
        {isRunning ? <Pause size={24} /> : <Play size={24} />}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={resetTimer}
        disabled={time === 0}
      >
        <RotateCcw size={24} />
      </Button>
      <span className="min-w-[80px] text-2xl font-mono">{formatTime(time)}</span>
      {currentTask && (
        <span className="text-md text-muted-foreground ml-2">{currentTask}</span>
      )}
    </div>
  );
}
