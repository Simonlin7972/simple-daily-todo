import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { GripVertical, Trash2, Edit2, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  deleteTodo
}) => {
  const { t } = useTranslation();

  return (
    <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
      {(provided, snapshot) => (
        <React.Fragment>
          <li
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`flex items-center group ${snapshot.isDragging ? 'opacity-70' : ''} ${transitioning === todo.id ? 'opacity-70 transition-all duration-300' : ''}`}
          >
            <span 
              {...provided.dragHandleProps} 
              className={`mr-2 cursor-move text-gray-300 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 ${isMobile ? '' : 'opacity-0 group-hover:opacity-100'}`}
            >
              <GripVertical size={20} />
            </span>
            <div className={`flex items-center justify-between p-2 rounded-lg border bg-card text-card-foreground shadow-sm flex-grow ${todo.type === 'section' ? 'bg-secondary border-secondary h-12' : ''} ${snapshot.isDragging ? 'rotate-1' : ''} hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200`}>
              <div className="flex items-center flex-grow">
                {todo.type === 'todo' && (
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="mr-3 ml-3"
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
                  <span 
                    className={`${todo.completed ? 'line-through text-muted-foreground' : ''} text-sm flex-grow text-left ${todo.type === 'section' ? 'font-bold text-sm pl-2' : ''} cursor-pointer`}
                    onClick={(e) => startEditing(todo.id, todo.text, e)}
                  >
                    {todo.text}
                  </span>
                )}
              </div>
              <div className={`flex space-x-1 ml-2 ${editingId === todo.id ? '' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-200`}>
                {editingId === todo.id ? (
                  isMobile ? (
                    <Button variant="ghost" size="icon" onClick={() => saveEdit(todo.id)}>
                      <Check size={16} />
                    </Button>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => saveEdit(todo.id)}>
                          <Check size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('save')}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                ) : (
                  <>
                    {isMobile ? (
                      <>
                        <Button variant="ghost" size="icon" onClick={(e) => startEditing(todo.id, todo.text, e)}>
                          <Edit2 size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </>
                    ) : (
                      <>
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
                  </>
                )}
              </div>
            </div>
          </li>
          {snapshot.isDragging && (
            <li className="h-[52px] ml-8 bg-gray-100 dark:bg-gray-800 rounded-md my-2 transition-all duration-200"></li>
          )}
        </React.Fragment>
      )}
    </Draggable>
  );
};
