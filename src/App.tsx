import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { TodoList } from './components/TodoList'
import { ThemeProvider } from "./components/theme-provider";
import { TopNavBar } from "./components/TopNavBar"
import { BottomBar } from "./components/BottomBar"
import { DailyReview } from './components/DailyReview'
import { Profile } from './components/Profile'
import './App.css'
import './i18n'
import { Toaster } from "@/components/ui/sonner"
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "./components/ui/command"

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [open, setOpen] = useState(false)
  const [newTask, setNewTask] = useState("")

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
        <div className="min-h-screen font-sans antialiased bg-background text-foreground flex flex-col">
          <TopNavBar currentTime={formatTime(currentTime)} />
          <main className="flex-grow w-full py-8 pb-28 bg-gradient-to-b from-background to-muted">
            <Routes>
              <Route path="/" element={<TodoList />} />
              <Route path="/daily-review" element={<DailyReview />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <BottomBar />
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
      </ThemeProvider>
    </Router>
  )
};

export default App;
