import React from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { Button } from "../components/ui/button";
import { ModeToggle } from "../components/mode-toggle";
import { LanguageToggle } from "../components/language-toggle";

interface MobileMenuProps {
  currentTime: string;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ currentTime }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[300px]">
        <div className="flex flex-col space-y-4 mt-4">
          <span className="text-sm">{currentTime}</span>
          <LanguageToggle isMobile={true} />
          <ModeToggle isMobile={true} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
