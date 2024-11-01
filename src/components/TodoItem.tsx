import React, { useState, useEffect } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { GripVertical, Trash2, Edit2, Play, Pause, Ellipsis } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface TodoItemProps {
  todo: {
    id: number;
    text: string;
    completed: boolean;
    type: 'todo' | 'section';
  };
  index: number;
  editingId: number | null;
  editText: string;
  isMobile: boolean;
  transitioning: number | null;
  toggleTodo: (id: number) => void;
  startEditing: (id: number, text: string, event: React.MouseEvent) => void;
  setEditText: (text: string) => void;
  handleEditKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, id: number) => void;
  saveEdit: (id: number) => void;
  deleteTodo: (id: number) => void;
  isDragging: boolean;
  draggingItemId: number | null;
  setDraggingItemId: (id: number | null) => void;
  onStartTimer: (taskText: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  index,
  editingId,
  editText,
  isMobile,
  transitioning,
  toggleTodo,
  startEditing,
  setEditText,
  handleEditKeyDown,
  saveEdit,
  deleteTodo,
  isDragging,
  draggingItemId,
  setDraggingItemId,
  onStartTimer
}) => {
  const { t } = useTranslation();
  const [timerInfo, setTimerInfo] = useState<{ time: number; isRunning: boolean } | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const handleTimerUpdate = (event: CustomEvent<{ taskText: string; time: number; isRunning: boolean }>) => {
      if (event.detail.taskText === todo.text) {
        setTimerInfo({ time: event.detail.time, isRunning: event.detail.isRunning });
      }
    };

    const handleTimerStateUpdate = (event: CustomEvent<{ taskText: string; isRunning: boolean }>) => {
      if (event.detail.taskText === todo.text) {
        setTimerInfo(prev => prev ? { ...prev, isRunning: event.detail.isRunning } : null);
      }
    };

    window.addEventListener('timerUpdate', handleTimerUpdate as EventListener);
    window.addEventListener('timerStateUpdate', handleTimerStateUpdate as EventListener);

    return () => {
      window.removeEventListener('timerUpdate', handleTimerUpdate as EventListener);
      window.removeEventListener('timerStateUpdate', handleTimerStateUpdate as EventListener);
    };
  }, [todo.text]);

  const handleTimerClick = () => {
    if (timerInfo) {
      // 如果已經在計時，發送切換事件
      window.dispatchEvent(new CustomEvent('toggleTimer', { 
        detail: { taskText: todo.text } 
      }));
    } else {
      // 如果還沒開始計時，發送開始事件
      onStartTimer(todo.text);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

 // mobile 上的 action sheet 按鈕
  const ActionButtons = () => (
    <>
      {todo.type === 'todo' && (
        <Button 
          variant="ghost" 
          size="lg" 
          onClick={handleTimerClick}
          className="w-full justify-start p-4"
        >
          {timerInfo?.isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
          {timerInfo?.isRunning ? t('pauseTimer') : t('startTimer')}
        </Button>
      )}
      <Button 
        variant="ghost" 
        size="lg" 
        onClick={(e) => {
          startEditing(todo.id, todo.text, e);
          setIsSheetOpen(false);
        }}
        className="w-full justify-start p-4"
      >
        <Edit2 className="mr-2 h-4 w-4" />
        {t('edit')}
      </Button>
      <Button 
        variant="ghost" 
        size="lg" 
        onClick={() => {
          deleteTodo(todo.id);
          setIsSheetOpen(false);
        }}
        className="w-full justify-start p-4 text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        {t('delete')}
      </Button>
    </>
  );

  return (
    <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
      {(provided, snapshot) => {
        // 更新正在拖動的項目 ID
        if (snapshot.isDragging) {
          setDraggingItemId(todo.id);
        } else if (draggingItemId === todo.id && !snapshot.isDragging) {
          setDraggingItemId(null);
        }

        return (
          <React.Fragment>
            <li
              ref={provided.innerRef}
              {...provided.draggableProps}
              className={`flex items-center group h-14 max-w-full ${snapshot.isDragging ? 'opacity-70' : ''} ${transitioning === todo.id ? 'opacity-70 transition-all duration-300' : ''}`}
            >
              <span 
                {...provided.dragHandleProps} 
                className={`mr-2 cursor-move text-gray-300 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 ${
                  isMobile ? '' : isDragging && draggingItemId !== todo.id ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                <GripVertical size={20} />
              </span>
              <div className={`flex items-center justify-between p-2 rounded-lg border bg-card text-card-foreground shadow-sm flex-grow h-full max-w-[calc(100%-2rem)] ${todo.type === 'section' ? 'bg-secondary border-secondary' : ''} ${snapshot.isDragging ? 'rotate-1' : ''} ${!isDragging ? 'hover:border-gray-300 dark:hover:border-gray-600' : ''} transition-colors duration-200`}>
                <div className="flex items-center flex-grow overflow-hidden pr-2">
                  {todo.type === 'todo' && (
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      className="mr-3 ml-3 flex-shrink-0"
                    />
                  )} 
                  {editingId === todo.id ? (
                    <Input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => handleEditKeyDown(e, todo.id)}
                      onBlur={() => saveEdit(todo.id)}
                      autoFocus
                      className="flex-grow mr-2 h-8"
                    />
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span 
                          className={`${todo.completed ? 'line-through text-muted-foreground' : ''} text-sm flex-grow text-left ${todo.type === 'section' ? 'font-bold text-sm pl-2' : ''} cursor-pointer truncate flex items-center`}
                          onClick={(e) => startEditing(todo.id, todo.text, e)}
                        >
                          
                          {timerInfo && (
                            <Badge 
                              variant="secondary" 
                              className="mr-2"
                            >
                              {formatTime(timerInfo.time)}
                            </Badge>
                          )}
                          {todo.text}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{todo.text}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <div className={`flex-shrink-0 w-32 flex justify-end ${editingId === todo.id ? '' : isMobile ? '' : isDragging ? 'invisible' : 'invisible group-hover:visible'} transition-opacity duration-200`}>
                  {isMobile ? (
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Ellipsis size={16} />
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="bottom" className="p-2 rounded-xl">
                        <div className="grid gap-2 pt-8 pb-4">
                          <ActionButtons />
                        </div>
                      </SheetContent>
                    </Sheet>
                  ) : (
                    <>
                      {todo.type === 'todo' && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={handleTimerClick}
                            >
                              {timerInfo?.isRunning ? <Pause size={16} /> : <Play size={16} />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{timerInfo?.isRunning ? t('pauseTimer') : t('startTimer')}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={(e) => startEditing(todo.id, todo.text, e)}>
                            <Edit2 size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t('edit')}</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t('delete')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </>
                  )}
                </div>
              </div>
            </li>
            {snapshot.isDragging && (
              <li className="h-14 ml-8 bg-gray-100 dark:bg-gray-800 rounded-md my-2 transition-all duration-200"></li>
            )}
          </React.Fragment>
        );
      }}
    </Draggable>
  );
};
