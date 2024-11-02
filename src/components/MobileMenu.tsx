import React from 'react';
import { Menu, UserCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

interface MobileMenuProps {
  currentTime: string;
  onAddData: () => void;
  onReset: () => void;
  // setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  // setCompletedTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ currentTime, onAddData, onReset }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) { // md breakpoint
        setOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Run once on mount

  const handleProfileClick = () => {
    navigate('/profile');
    setOpen(false); // 關閉選單
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[300px]">
        <div className="flex flex-col space-y-4 mt-4">
          <span className="text-sm">{currentTime}</span>
          <Button
            variant="outline"
            className="w-full justify-center"
            onClick={handleProfileClick}
          >
            <UserCircle className="mr-2 h-4 w-4" />
            {t('profile')}
          </Button>
          <Button variant="outline" id="addDataBtn" onClick={onAddData}>{t('addData')}</Button>
          <Button variant="outline" id="resetBtn" onClick={onReset}>{t('reset')}</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
