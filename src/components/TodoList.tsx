import React, { useState, KeyboardEvent, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";

import './TodoList.css';
import sampleData from '../sampleData.json';
import { useTranslation } from 'react-i18next';

import { toast } from 'sonner';
import { TodoItem } from './TodoItem';
import { CompletedPanel } from './CompletedPanel';
import useLocalStorage from '../hooks/useLocalStorage';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  type: 'todo' | 'section';
}

export function TodoList() {
  const { t, i18n } = useTranslation();
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
  const [completedTodos, setCompletedTodos] = useLocalStorage<Todo[]>('completedTodos', []);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [titleText, setTitleText] = useState('');
  const fullTitle = t('whatDoYouWantToGetDoneToday');
  const [shouldResetTitle, setShouldResetTitle] = useState(false);
  const [transitioning, setTransitioning] = useState<number | null>(null);
  const [targetTasks, setTargetTasks] = useLocalStorage<number>('targetTasks', 10);

  const isMobile = window.innerWidth < 768; // 簡單的移動設備檢測

  const startTitleAnimation = useCallback(() => {
    let index = 0;
    setTitleText('');
    const intervalId = setInterval(() => {
      setTitleText(prev => fullTitle.slice(0, prev.length + 1));
      index++;
      if (index >= fullTitle.length) {
        clearInterval(intervalId);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [fullTitle]);

  useEffect(() => {
    const cleanup = startTitleAnimation();
    return cleanup;
  }, [startTitleAnimation, shouldResetTitle]);

  useEffect(() => {
    const addDataBtn = document.getElementById('addDataBtn');
    const resetBtn = document.getElementById('resetBtn');

    const addSampleData = () => {
      const currentLanguage = i18n.language.startsWith('zh') ? 'zh' : 'en';
      const newTodos = sampleData[currentLanguage].todos.map(todo => ({
        ...todo,
        id: Date.now() + Math.random(),
        type: todo.type as 'todo' | 'section'
      }));
      const newCompletedTodos = sampleData[currentLanguage].completedTodos.map(todo => ({
        ...todo,
        id: Date.now() + Math.random(),
        type: todo.type as 'todo' | 'section'
      }));

      setTodos([...newTodos]);
      setCompletedTodos([...newCompletedTodos]);

      toast.success(t('sampleDataAdded'), {
        description: t('sampleDataAddedDescription'),
        duration: 1000,
        style: {
          textAlign: 'left',
          justifyContent: 'flex-start',
          fontWeight: 'bold',
        },
      });
    };

    const resetApp = () => {
      setTodos([]);
      setCompletedTodos([]);
      setNewTodo('');
      setEditingId(null);
      setEditText('');
      setShouldResetTitle(prev => !prev); // 觸發標題動畫重置
    };

    addDataBtn?.addEventListener('click', addSampleData);
    resetBtn?.addEventListener('click', resetApp);

    return () => {
      addDataBtn?.removeEventListener('click', addSampleData);
      resetBtn?.removeEventListener('click', resetApp);
    };
  }, [i18n.language, t]);

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false, type: 'todo' }]);
      setNewTodo('');
    }
  };

  const addSection = () => {
    const newSection: Todo = { id: Date.now(), text: t('newSection'), completed: false, type: 'section' };
    setTodos([...todos, newSection]);
    startEditing(newSection.id, newSection.text, {} as React.MouseEvent);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTodo.trim() !== '') {
      addTodo();
    }
  };

  const toggleTodo = (id: number) => {
    const todoToToggle = todos.find(todo => todo.id === id);
    if (todoToToggle && !todoToToggle.completed) {
      setTransitioning(id);
      setTodos(prevTodos => prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: true } : todo
      ));
      
      setTimeout(() => {
        setCompletedTodos(prevCompleted => [...prevCompleted, { ...todoToToggle, completed: true }]);
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        setTransitioning(null);
      }, 300);
    } else if (todoToToggle) {
      setTodos(prevTodos => prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ));
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const startEditing = (id: number, text: string, event: React.MouseEvent) => {
    // 防觸發 checkbox 的點擊事件
    event.stopPropagation();
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: editText } : todo
    ));
    setEditingId(null);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: number) => {
    if (e.key === 'Enter') {
      saveEdit(id);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      // 在同一列表內移動
      const items = Array.from(source.droppableId === 'todos' ? todos : completedTodos);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      if (source.droppableId === 'todos') {
        setTodos(items);
      } else {
        setCompletedTodos(items);
      }
    } else {
      // 在列表之間移動
      const sourceItems = Array.from(source.droppableId === 'todos' ? todos : completedTodos);
      const destItems = Array.from(destination.droppableId === 'todos' ? todos : completedTodos);
      const [movedItem] = sourceItems.splice(source.index, 1);

      if (destination.droppableId === 'completed') {
        movedItem.completed = true;
      } else {
        movedItem.completed = false;
      }

      destItems.splice(destination.index, 0, movedItem);

      if (source.droppableId === 'todos') {
        setTodos(sourceItems);
        setCompletedTodos(destItems);
      } else {
        setCompletedTodos(sourceItems);
        setTodos(destItems);
      }
    }
  };

  const restoreTodo = (id: number) => {
    const todoToRestore = completedTodos.find(todo => todo.id === id);
    if (todoToRestore) {
      setTodos(prevTodos => [...prevTodos, { ...todoToRestore, completed: false }]);
      setCompletedTodos(prevCompleted => prevCompleted.filter(todo => todo.id !== id));
    }
  };

  const handleSaveRecap = (recap: string, mood: string) => {
    // 清除已完成的任務
    setCompletedTodos([]);
    
    // 將所有未完成的任務標記為已完成
    setTodos(prevTodos => prevTodos.map(todo => ({ ...todo, completed: true })));
    
    // 使用 localStorage 來存儲 recap 和 mood
    localStorage.setItem('dailyRecap', JSON.stringify({ text: recap, mood }));
  };

  // 在組件卸載時保存數據
  useEffect(() => {
    return () => {
      localStorage.setItem('todos', JSON.stringify(todos));
      localStorage.setItem('completedTodos', JSON.stringify(completedTodos));
      localStorage.setItem('targetTasks', JSON.stringify(targetTasks));
    };
  }, [todos, completedTodos, targetTasks]);

  return (
    <TooltipProvider>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col justify-center h-full py-4">
          <div className="flex flex-col lg:flex-row justify-center lg:space-x-4 w-full max-w-5xl mx-auto px-4 lg:px-0">
            <Card className="w-full lg:max-w-xl mb-4 lg:mb-0 shadow-sm rounded-xl">
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
            {completedTodos.length > 0 && (
              <CompletedPanel 
                completedTodos={completedTodos} 
                onRestore={restoreTodo} 
                isMobile={isMobile}
                targetTasks={targetTasks}
                onTargetTasksChange={setTargetTasks}
                onSaveRecap={handleSaveRecap}
              />
            )}
          </div>
        </div>
      </DragDropContext>
    </TooltipProvider>
  );
}
