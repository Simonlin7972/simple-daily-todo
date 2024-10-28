import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { useTranslation } from 'react-i18next';

const RepeatTodoManagement: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-4">
      <Breadcrumb currentPage={t('repeatTodoManagement')} />
      <h1 className="text-2xl font-bold">{t('repeatTodoManagement')}</h1>
      <p>{t('manageYourRepeatTodos')}</p>
      {/* 這裡可以添加更多的功能和內容 */}
    </div>
  );
};

export default RepeatTodoManagement;
