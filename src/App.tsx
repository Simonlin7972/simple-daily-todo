import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { TodoList } from './components/TodoList'
import { ThemeProvider } from "@/components/theme-provider"
import { TopNavBar } from "@/components/TopNavBar"
import { BottomBar } from "@/components/BottomBar"
import { DailyReview } from './components/DailyReview'
import './App.css'
import './i18n'
import { Toaster } from 'sonner'

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

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

  return (
    <Router>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen font-sans antialiased bg-background text-foreground flex flex-col">
          <TopNavBar currentTime={formatTime(currentTime)} />
          <main className="flex-grow w-full py-8 pb-28 bg-gradient-to-b from-background to-muted">
            <Routes>
              <Route path="/" element={<TodoList />} />
              <Route path="/daily-review" element={<DailyReview />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <BottomBar />
          <Toaster />
        </div>
      </ThemeProvider>
    </Router>
  )
};

export default App;
