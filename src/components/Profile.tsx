import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Profile: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto px-4">
      
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="text-left text-4xl">Hello, Simon!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 p-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('languageSettings')}</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="english">English</Label>
                  <Switch id="english" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="chinese">中文</Label>
                  <Switch id="chinese" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('themeSettings')}</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="light">{t('lightTheme')}</Label>
                  <Switch id="light" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark">{t('darkTheme')}</Label>
                  <Switch id="dark" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
