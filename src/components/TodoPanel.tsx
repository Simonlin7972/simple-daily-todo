import React, { KeyboardEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droppable } from '@hello-pangea/dnd';
import { TodoItem } from './TodoItem';
import { useTranslation } from 'react-i18next';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  type: 'todo' | 'section';
}

interface TodoPanelProps {
  todos: Todo[];
  newTodo: string;
  editingId: number | null;
  editText: string;
  isMobile: boolean;
  transitioning: number | null;
  titleText: string;
  setNewTodo: (value: string) => void;
  addTodo: () => void;
  toggleTodo: (id: number) => void;
  startEditing: (id: number, text: string, event: React.MouseEvent) => void;
  setEditText: (value: string) => void;
  handleEditKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, id: number) => void;
  saveEdit: (id: number) => void;
  deleteTodo: (id: number) => void;
  addSection: () => void;
}

export const TodoPanel: React.FC<TodoPanelProps> = ({
  todos,
  newTodo,
  editingId,
  editText,
  isMobile,
  transitioning,
  titleText,
  setNewTodo,
  addTodo,
  toggleTodo,
  startEditing,
  setEditText,
  handleEditKeyDown,
  saveEdit,
  deleteTodo,
  addSection
}) => {
  const { t } = useTranslation();

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTodo.trim() !== '') {
      addTodo();
    }
  };

  return (
    <Card className="w-full lg:max-w-2xl mb-4 lg:mb-0">
      <CardHeader>
        <CardTitle className="typewriter-title">
          {titleText}<span className="caret"></span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-4">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('addTodoPlaceholder')}
            className="flex-grow text-md h-14 ml-7 transition-all duration-200 border-2 hover:border-gray-600 dark:hover:border-gray-500 hover:border-2 focus:border-2 focus:border-primary rounded-lg"
          />
          <Button onClick={addTodo} disabled={newTodo.trim() === ''} className="h-14 w-32 font-bold rounded-lg">{t('addTodo')}</Button>
        </div>
        <Droppable droppableId="todos">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {todos.map((todo, index) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  index={index}
                  editingId={editingId}
                  editText={editText}
                  isMobile={isMobile}
                  transitioning={transitioning}
                  toggleTodo={toggleTodo}
                  startEditing={startEditing}
                  setEditText={setEditText}
                  handleEditKeyDown={handleEditKeyDown}
                  saveEdit={saveEdit}
                  deleteTodo={deleteTodo}
                />
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
        {todos.length > 0 && (
          <div className="ml-7">
            <Button 
              variant="ghost" 
              className="w-full mt-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={addSection}
            >
              + {t('addSection')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
