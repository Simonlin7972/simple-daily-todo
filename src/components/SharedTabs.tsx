import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const SharedTabs: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    navigate(value);
  };

  return (
    <Tabs value={location.pathname} onValueChange={handleTabChange} className="w-full max-w-2xl mx-auto mb-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="/" id="todoListTab">
          {t('todoList')}
        </TabsTrigger>
        <TabsTrigger value="/daily-review" id="dailyReviewTab">
          {t('dailyReview')}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
