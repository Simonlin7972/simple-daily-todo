import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components
import { useTranslation } from 'react-i18next';

const TodoHistory: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container max-w-2xl mx-auto px-4 pt-6 space-y-6">
      <Breadcrumb currentPage={t('todoHistory')} />
      <Card className="max-w-2xl mx-auto p-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{t('todoHistory')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t('viewYourTodoHistory')}</p>
          {/* 這裡可以添加更多的功能和內容 */}
        </CardContent>
      </Card>
    </div>
  );
};

export default TodoHistory;
