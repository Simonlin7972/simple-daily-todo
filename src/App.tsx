import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { TodoList } from './components/TodoList'
import { ThemeProvider } from "./components/theme-provider";
import { TopNavBar } from './components/layout/TopNavBar';
import { BottomBar } from './components/layout/BottomBar';
import { DailyReview } from './components/DailyReview'
import { Profile } from './components/Profile'

import './App.css'
import './i18n'
import { Toaster } from "@/components/ui/sonner"
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "./components/ui/command"
import { FontProvider } from './contexts/FontContext';
import RepeatTodoManagement from './pages/RepeatTodoManagement';
import TodoHistory from './pages/TodoHistory';
import { FocusPage } from './pages/FocusPage';
import { CSSTransition } from 'react-transition-group';

export type Font = 'inter' | 'roboto' | 'open-sans' | 'lato' | 'poppins' | 'montserrat';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [open, setOpen] = useState(false)
  const [newTask, setNewTask] = useState("")
  const showNavBar = location.pathname !== '/focus';
  const showBottomBar = location.pathname !== '/focus';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleAddTask = () => {
    // 這裡添加新任務到 todo list 的邏輯
    console.log("Adding new task:", newTask)
    setNewTask("")
    setOpen(false)
  }

  return (
    <Router>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <FontProvider>
          <div className="font-sans antialiased bg-background text-foreground flex flex-col bg-gradient-to-b from-background to-muted min-h-screen pb-12">
          {/* 如果當前路徑不是 /focus，則顯示 TopNavBar */}
          
          <CSSTransition
            in={showNavBar}
            timeout={200}
            classNames="navbar"
            unmountOnExit
          >
            <TopNavBar currentTime={formatTime(currentTime)} /> 
          </CSSTransition>


      {/* {location.pathname !== '/focus' && (
              <TopNavBar currentTime={formatTime(currentTime)} />
            )} */}
      


            <div className="main-content py-16">
              <Routes>
                <Route path="/" element={<TodoList />} />
                <Route path="/daily-review" element={<DailyReview />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/focus" element={<FocusPage />} />
                <Route path="/todo-history" element={<TodoHistory />} />
                <Route path="/repeat-todo-management" element={<RepeatTodoManagement />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>

            {/* {location.pathname !== '/focus' && (
              <BottomBar />
            )} */}
<CSSTransition
            in={showBottomBar}
            timeout={200} 
            classNames="bottombar"
            unmountOnExit
          >
            <BottomBar /> 
          </CSSTransition>


            <Toaster />
            <CommandDialog open={open} onOpenChange={setOpen}>
              <CommandInput 
                placeholder="輸入新任務..." 
                value={newTask}
                onValueChange={setNewTask}
              />
              <CommandList>
                <CommandEmpty>沒有找到相關任務</CommandEmpty>
                <CommandGroup heading="操作">
                  <CommandItem onSelect={handleAddTask}>
                    添加新任務
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </CommandDialog>
          </div>
        </FontProvider>
      </ThemeProvider>
    </Router>
  )
};

export default App;
