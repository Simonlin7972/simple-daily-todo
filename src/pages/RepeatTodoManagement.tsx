import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';

const RepeatTodoManagement: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container max-w-2xl mx-auto px-4 pt-6 space-y-6">
      <Breadcrumb currentPage={t('repeatTodoManagement')} />
      <Card className="max-w-2xl mx-auto p-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{t('repeatTodoManagement')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t('manageYourRepeatTodos')}</p>
          {/* 這裡可以添加更多的功能和內容 */}
        </CardContent>
      </Card>
    </div>
  );
};

export default RepeatTodoManagement;
