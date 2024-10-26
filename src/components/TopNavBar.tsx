import React from "react";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "./language-toggle";
import { ModeToggle } from "./mode-toggle";
import { MobileMenu } from "./MobileMenu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";

interface TopNavBarProps {
  currentTime: string;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({ currentTime }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    navigate(value);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="relative flex h-16 items-center px-4">
        {/* App Title */}
        <Link
          to="/"
          className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center"
        >
          <span className="font-['Pacifico'] text-2xl font-bold text-primary whitespace-nowrap">
            {t("appTitle")}
          </span>
        </Link>

        {/* Navigation Tabs */}
        <Tabs
          value={location.pathname}
          onValueChange={handleTabChange}
          className="mr-auto"
        >
          <TabsList>
            <TabsTrigger value="/">{t("todoList")}</TabsTrigger>
            <TabsTrigger value="/daily-review">{t("dailyReview")}</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Right side elements: Time, Language Toggle, Mode Toggle, Mobile Menu */}
        <div className="ml-auto flex items-center space-x-4">
          <span className="text-sm hidden md:inline">{currentTime}</span>
          <div className="hidden md:flex items-center space-x-2">
            <LanguageToggle />
            <ModeToggle />
          </div>
          <MobileMenu currentTime={currentTime} />
        </div>
      </div>
    </header>
  );
};
