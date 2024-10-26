import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import { Moon, Sun, Globe, ChevronRight, Languages, Palette, Repeat, History } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export const Profile: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { setTheme, theme } = useTheme();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6">
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="text-left text-5xl">Hello, Simon!</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Languages className="h-6 w-6 text-muted-foreground" />
              <div className="flex-grow flex justify-between items-center">
                <h3 className="text-lg font-medium">{t('languageSettings')}</h3>
                <Tabs defaultValue={i18n.language} onValueChange={toggleLanguage}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="en">
                      English
                    </TabsTrigger>
                    <TabsTrigger value="zh">
                      繁體中文
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <Separator className="my-4" />
        
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
    </div>
  );
};
