import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from "./language-toggle";
import { ModeToggle } from "./mode-toggle";
import { MobileMenu } from "./MobileMenu";
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";

interface TopNavBarProps {
  currentTime: string;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({ currentTime }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="relative flex h-16 items-center px-4">
        {/* App Title */}
        <Link to="/" className="flex items-center justify-center">
          <span className="font-['Pacifico'] text-2xl font-bold text-primary whitespace-nowrap">{t('appTitle')}</span>
        </Link>

        {/* Right side elements: Time, Language Toggle, Mode Toggle, Profile Button, Mobile Menu */}
        <div className="ml-auto flex items-center space-x-4">
          <span className="text-sm hidden md:inline">{currentTime}</span>
          <div className="hidden md:flex items-center space-x-2">
            <LanguageToggle />
            <ModeToggle />
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/profile')}
              className="w-10 h-10"
            >
              <UserCircle className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">{t('profile')}</span>
            </Button>
          </div>
          <MobileMenu currentTime={currentTime} />
        </div>
      </div>
    </header>
  );
};
