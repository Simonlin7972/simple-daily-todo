import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, Undo2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CompletedItemProps {
  todo: {
    id: number;
    text: string;
  };
  index: number;
  onRestore: (id: number) => void;
  isMobile: boolean;
}

export const CompletedItem: React.FC<CompletedItemProps> = ({ todo, index, onRestore, isMobile }) => {
  const { t } = useTranslation();

  return (
    <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
      {(provided) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="flex items-center justify-between p-2 pl-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200"
        >
          <div className="flex items-center flex-grow mr-2">
            <Check size={20} className="text-gray-300 mr-2 flex-shrink-0" />
            <span className="text-sm max-w-80 md:max-w-full line-through truncate">{todo.text}</span>
          </div>
          {isMobile ? (
            <Button variant="ghost" size="icon" onClick={() => onRestore(todo.id)} className="flex-shrink-0">
              <Undo2 size={16} />
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => onRestore(todo.id)} className="flex-shrink-0">
                  <Undo2 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('restore')}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </li>
      )}
    </Draggable>
  );
};
