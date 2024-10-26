import React from 'react';
import { useTranslation } from 'react-i18next';

export const Profile: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">{t('profile')}</h1>
      <p>{t('profileDescription')}</p>
      {/* Add more profile content here */}
    </div>
  );
};
