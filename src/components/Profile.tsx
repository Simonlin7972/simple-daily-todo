import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import { Moon, Sun, ChevronRight, Languages, Palette, Repeat, History, Type, Heart, Pencil } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFont } from '../contexts/FontContext';
import { Breadcrumb } from './Breadcrumb';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useLocalStorage from "@/hooks/useLocalStorage";
import { XIcon } from "lucide-react";
type Font = 'inter' | 'roboto' | 'open-sans' | 'lato' | 'poppins';

export const Profile: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { setTheme, theme } = useTheme();
  const { font, setFont } = useFont();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  const fonts = [
    { value: 'inter', label: 'Inter' },
    { value: 'roboto', label: 'Roboto' },
    { value: 'open-sans', label: 'Open Sans' },
    { value: 'lato', label: 'Lato' },
    { value: 'poppins', label: 'Poppins' },
  ];

  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [userName, setUserName] = useLocalStorage<string>("userName", "") as [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ];

  const handleNameSubmit = () => {
    if (newName.trim()) {
      setUserName(newName.trim());
      setIsNameDialogOpen(false);
      setNewName("");
    }
  };

  return (
    <div className={`font-${font} max-w-2xl mx-auto px-4 pt-6 space-y-6`}>
      <Breadcrumb currentPage={t('profile')} />
      
      {/* Settings Card */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="text-left text-5xl">Hello, {userName || "Simon!"}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          <div className="space-y-6">
            {/* 使用者名稱設置 */}
            <div className="flex items-center space-x-4">
              <Pencil className="h-6 w-6 text-muted-foreground" />
              <div className="flex-grow flex justify-between items-center">
                <h3 className="text-lg font-medium">{t('userName')}</h3>
                <Button variant="outline" size="sm" onClick={() => setIsNameDialogOpen(true)}>
                  {userName || t('setUserName')}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Dialog open={isNameDialogOpen} onOpenChange={setIsNameDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('userName')}</DialogTitle>
                    </DialogHeader>
                    <Input value={newName || userName} onChange={(e) => setNewName(e.target.value)} placeholder={t('enterUserName')} defaultValue={userName} />
                    <DialogFooter>
                      <Button variant="outline" size="sm" onClick={() => setIsNameDialogOpen(false)}>
                        {t('cancel')}
                      </Button>
                      <Button variant="default" size="sm" onClick={handleNameSubmit} type="submit">
                        {t('save')}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Separator className="my-4" />
        
            {/* 語言設置 */}
            <div className="flex items-center space-x-4">
              <Languages className="h-6 w-6 text-muted-foreground" />
              <div className="flex-grow flex justify-between items-center">
                <h3 className="text-lg font-medium">{t('languageSettings')}</h3>
                <Tabs defaultValue={i18n.language} onValueChange={toggleLanguage}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="zh">繁體中文</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <Separator className="my-4" />
        
            {/* 主題設置 */}
            <div className="flex items-center space-x-4">
              <Palette className="h-6 w-6 text-muted-foreground" />
              <div className="flex-grow flex justify-between items-center">
                <h3 className="text-lg font-medium">{t('themeSettings')}</h3>
                <Tabs defaultValue={theme} onValueChange={setTheme}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="light">
                      <Sun className="mr-2 h-4 w-4" />
                      {t('themeLight')}
                    </TabsTrigger>
                    <TabsTrigger value="dark">
                      <Moon className="mr-2 h-4 w-4" />
                      {t('themeDark')}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <Separator className="my-4" />

            {/* 文字設定 */}
            <div className="flex items-center space-x-4">
              <Type className="h-6 w-6 text-muted-foreground" />
              <div className="flex-grow flex justify-between items-center">
                <h3 className="text-lg font-medium">{t('fontSettings')}</h3>
                <Select value={font} onValueChange={(value: Font) => setFont(value)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fonts.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="my-4" />

            {/* 每日重複待辦 */}
            <div className="flex items-center space-x-4">
              <Repeat className="h-6 w-6 text-muted-foreground" />
              <div className="flex-grow flex justify-between items-center">
                <h3 className="text-lg font-medium">{t('dailyRepeatTodos')}</h3>
                <Button variant="outline" size="sm">
                  {t('manage')}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator className="my-4" />

            {/* 歷史記錄 */}
            <div className="flex items-center space-x-4">
              <History className="h-6 w-6 text-muted-foreground" />
              <div className="flex-grow flex justify-between items-center">
                <h3 className="text-lg font-medium">{t('history')}</h3>
                <Button variant="outline" size="sm">
                  {t('view')}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Card */}
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="text-left text-2xl">{t('aboutApp')}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">
                {t('madeWith')} <Heart className="inline-block h-4 w-4 text-red-500" /> {t('by')} Simon Lin
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-xs text-muted-foreground">
                © 2024 Simple Daily Todo. {t('allRightsReserved')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
