import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { useTranslation } from 'react-i18next';

const TodoHistory: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-4">
      <Breadcrumb currentPage={t('todoHistory')} />
      <h1 className="text-2xl font-bold">{t('todoHistory')}</h1>
      <p>{t('viewYourTodoHistory')}</p>
      {/* 這裡可以添加更多的功能和內容 */}
    </div>
  );
};

export default TodoHistory;
