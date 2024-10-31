import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { TooltipProvider } from "@/components/ui/tooltip";
import { SharedTabs } from './SharedTabs';

import './TodoList.css';
import sampleData from '../sampleData.json';
import { useTranslation } from 'react-i18next';

import { toast } from 'sonner';
import { CompletedPanel } from './CompletedPanel';
import useLocalStorage from '../hooks/useLocalStorage';
import { TodoPanel } from './TodoPanel';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  type: 'todo' | 'section';
}

interface DailyRecap {
  text: string;
  mood: string;
  date?: string;
}

export function TodoList() {
  const { t, i18n } = useTranslation();
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []) as [
    Todo[],
    React.Dispatch<React.SetStateAction<Todo[]>>
  ];
  const [completedTodos, setCompletedTodos] = useLocalStorage<Todo[]>('completedTodos', []) as [
    Todo[],
    React.Dispatch<React.SetStateAction<Todo[]>>
  ];
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [titleText, setTitleText] = useState('');
  const fullTitle = t('whatDoYouWantToGetDoneToday');
  const [shouldResetTitle, setShouldResetTitle] = useState(false);
  const [transitioning, setTransitioning] = useState<number | null>(null);
  const [targetTasks, setTargetTasks] = useLocalStorage<number>('targetTasks', 10) as [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ];

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
      const newTodos = [
        { id: Date.now(), text: t('sampleSection1'), completed: false, type: 'section' as const },
        ...sampleData[currentLanguage].todos.slice(0, 3).map(todo => ({
          ...todo,
          id: Date.now() + Math.random(),
          type: 'todo' as const
        })),
        { id: Date.now() + 1, text: t('sampleSection2'), completed: false, type: 'section' as const },
        ...sampleData[currentLanguage].todos.slice(3, 6).map(todo => ({
          ...todo,
          id: Date.now() + Math.random(),
          type: 'todo' as const
        })),
        { id: Date.now() + 2, text: t('sampleSection3'), completed: false, type: 'section' as const },
        ...sampleData[currentLanguage].todos.slice(6).map(todo => ({
          ...todo,
          id: Date.now() + Math.random(),
          type: 'todo' as const
        }))
      ];

      const newCompletedTodos = sampleData[currentLanguage].completedTodos.map(todo => ({
        ...todo,
        id: Date.now() + Math.random(),
        type: 'todo' as const
      }));

      setTodos(newTodos);
      setCompletedTodos(newCompletedTodos);

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
      const newTodoItem: Todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        type: 'todo'
      };
      setTodos(prevTodos => [...prevTodos, newTodoItem]);
      setNewTodo('');
    }
  };

  const addSection = () => {
    const newSection: Todo = { id: Date.now(), text: t('newSection'), completed: false, type: 'section' };
    setTodos([...todos, newSection]);
    startEditing(newSection.id, newSection.text, {} as React.MouseEvent);
  };

  const toggleTodo = (id: number) => {
    const todoToToggle = todos.find(todo => todo.id === id);
    if (todoToToggle && !todoToToggle.completed) {
      setTransitioning(id);
      setTodos((prevTodos: Todo[]) => prevTodos.map((todo: Todo) =>
        todo.id === id ? { ...todo, completed: true } : todo
      ));
      
      setTimeout(() => {
        setCompletedTodos((prevCompleted: Todo[]) => [...prevCompleted, { ...todoToToggle, completed: true }]);
        setTodos((prevTodos: Todo[]) => prevTodos.filter((todo: Todo) => todo.id !== id));
        setTransitioning(null);
      }, 300);
    } else if (todoToToggle) {
      setTodos((prevTodos: Todo[]) => prevTodos.map((todo: Todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ));
    }
  };

  const deleteTodo = (id: number) => {
    setTodos((prevTodos: Todo[]) => prevTodos.filter((todo: Todo) => todo.id !== id));
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

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: number): void => {
    if (e.key === 'Enter') {
      saveEdit(id);
    }
  };

  const onDragEnd = (result: DropResult): void => {
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
      setTodos((prevTodos: Todo[]) => [...prevTodos, { ...todoToRestore, completed: false }]);
      setCompletedTodos((prevCompleted: Todo[]) => prevCompleted.filter((todo: Todo) => todo.id !== id));
    }
  };

  const handleSaveRecap = (recap: string, mood: string): void => {
    setCompletedTodos([]);
    const dailyRecap: DailyRecap = {
      text: recap,
      mood,
      date: new Date().toISOString()
    };
    localStorage.setItem('dailyRecap', JSON.stringify(dailyRecap));
  };

  // 在組件卸載時保存數據
  useEffect(() => {
    return () => {
      localStorage.setItem('todos', JSON.stringify(todos));
      localStorage.setItem('completedTodos', JSON.stringify(completedTodos));
      localStorage.setItem('targetTasks', JSON.stringify(targetTasks));
    };
  }, [todos, completedTodos, targetTasks]);

  const addEmptyTodo = () => {
    const newTodo = {
      id: Date.now(),
      text: t('newTask'), // 使用翻譯的文字
      completed: false,
      type: 'todo' as const
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const handleStartTimer = (taskText: string) => {
    const event = new CustomEvent('startTimer', { detail: { taskText } });
    window.dispatchEvent(event);
  };

  return (
    <TooltipProvider>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col justify-center h-full py-4">
 
          <div className="container mx-auto px-4">
          <SharedTabs />
            <div className={`grid ${completedTodos.length > 0 ? 'lg:grid-cols-2' : 'lg:grid-cols-1 lg:place-items-center'} gap-4 mx-auto`}>
              <TodoPanel
                todos={todos}
                newTodo={newTodo}
                editingId={editingId}
                editText={editText}
                isMobile={isMobile}
                transitioning={transitioning}
                titleText={titleText}
                setNewTodo={setNewTodo}
                addTodo={addTodo}
                toggleTodo={toggleTodo}
                startEditing={startEditing}
                setEditText={setEditText}
                handleEditKeyDown={handleEditKeyDown}
                saveEdit={saveEdit}
                deleteTodo={deleteTodo}
                addSection={addSection}
                addEmptyTodo={addEmptyTodo}
                onStartTimer={handleStartTimer}
              />
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
        </div>
      </DragDropContext>
    </TooltipProvider>
  );
}
