import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Droppable } from '@hello-pangea/dnd';
import { RecapDialog } from './RecapDialog';
import { CompletedItem } from './CompletedItem';
import { Badge } from "@/components/ui/badge";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  type: 'todo' | 'section';
}

interface CompletedPanelProps {
  completedTodos: Todo[];
  onRestore: (id: number) => void;
  isMobile: boolean;
  targetTasks: number;
  onTargetTasksChange: (value: number) => void;
  onSaveRecap: (recap: string, mood: string) => void;
}

export const CompletedPanel: React.FC<CompletedPanelProps> = ({
  completedTodos,
  onRestore,
  isMobile,
  targetTasks,
  onTargetTasksChange,
  onSaveRecap
}) => {
  const { t } = useTranslation();
  const progressValue = Math.min(completedTodos.length, targetTasks) * (100 / targetTasks);
  const isCompleted = completedTodos.length >= targetTasks;

  // 獲取今天的日期
  const today = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });

  return (
    <Card className="w-full lg:max-w-md shadow-sm rounded-x">
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          <CardTitle className="mr-4">{t('whatIveDoneToday')}</CardTitle>
          <Badge variant="secondary">{today}</Badge>
        </div>
        <Progress 
          value={progressValue} 
          className={`w-full h-2 mt-2 ${isCompleted ? 'bg-primary' : ''}`} 
        />
        <p className="text-sm text-muted-foreground pt-2 flex items-center justify-center">
          {t('tasksCompleted', { count: completedTodos.length })} / 
          <Select onValueChange={(value) => onTargetTasksChange(Number(value))}>
            <SelectTrigger className="w-[60px] h-6 text-sm ml-1 mr-1">
              <SelectValue placeholder={targetTasks.toString()} />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 15, 20, 25, 30].map((value) => (
                <SelectItem key={value} value={value.toString()}>{value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {t('targetTasks')}
        </p>
      </CardHeader>
      <CardContent>
        <Droppable droppableId="completed">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 pl-4">
              {completedTodos.map((todo, index) => (
                <CompletedItem
                  key={todo.id}
                  todo={todo}
                  index={index}
                  onRestore={onRestore}
                  isMobile={isMobile}
                />
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
        
        <RecapDialog completedTodos={completedTodos} onSaveRecap={onSaveRecap} />
      </CardContent>
    </Card>
  );
};
