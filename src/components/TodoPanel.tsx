import React, { KeyboardEvent, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droppable, DroppableStateSnapshot } from '@hello-pangea/dnd';
import { TodoItem } from './TodoItem';
import { useTranslation } from 'react-i18next';

// 定義 Todo 項目的結構
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  type: 'todo' | 'section';
}

// 定義 TodoPanel 組件的 props
interface TodoPanelProps {
  todos: Todo[];
  newTodo: string;
  editingId: number | null;
  editText: string;
  isMobile: boolean;
  transitioning: number | null;
  titleText: string;
  setNewTodo: React.Dispatch<React.SetStateAction<string>>;
  addTodo: () => void;
  toggleTodo: (id: number) => void;
  startEditing: (id: number, text: string, event: React.MouseEvent) => void;
  setEditText: React.Dispatch<React.SetStateAction<string>>;
  handleEditKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, id: number) => void;
  saveEdit: (id: number) => void;
  deleteTodo: (id: number) => void;
  addSection: () => void;
  addEmptyTodo: () => void;
  onStartTimer: (taskText: string) => void;
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
  addSection,
  addEmptyTodo,
  onStartTimer
}) => {
  const { t } = useTranslation();
  // 狀態管理：是否有項目正在被拖動
  const [isDragging, setIsDragging] = useState(false);
  // 狀態管理：正在被拖動的項目 ID
  const [draggingItemId, setDraggingItemId] = useState<number | null>(null);

  // 處理按下 Enter 鍵添加新任務
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTodo.trim() !== '') {
      addTodo();
    }
  };

  return (
    <Card className="w-full lg:max-w-2xl mb-4 lg:mb-0">
      <CardHeader>
        {/* 顯示標題文字 */}
        <CardTitle className="typewriter-title">
          {titleText}<span className="caret"></span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 輸入新任務的表單 */}
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
        {/* 可拖放的任務列表區域 */}
        <Droppable droppableId="todos">
          {(provided, snapshot: DroppableStateSnapshot) => {
            // 更新拖動狀態
            if (isDragging !== snapshot.isDraggingOver) {
              setIsDragging(snapshot.isDraggingOver);
            }
            return (
              <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {/* 渲染每個 TodoItem */}
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
                    isDragging={isDragging}
                    draggingItemId={draggingItemId}
                    setDraggingItemId={setDraggingItemId}
                    onStartTimer={onStartTimer}
                  />
                ))}
                {provided.placeholder}
              </ul>
            );
          }}
        </Droppable>
        {/* 添加新分類的按鈕，僅在非拖動狀態下顯示 */}
        {todos.length > 0 && !isDragging && (
          <div className="ml-7 flex space-x-2 mt-4">
            <Button 
              variant="ghost" 
              className="flex-1 text-muted-foreground hover:text-foreground transition-colors"
              onClick={addEmptyTodo}
            >
              + {t('addTask')}
            </Button>
            <Button 
              variant="ghost" 
              className="flex-1 text-muted-foreground hover:text-foreground transition-colors"
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
