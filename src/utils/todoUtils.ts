// src/utils/todoUtils.ts
import sampleData from '../sampleData.json';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const generateSampleTodos = (setTodos: React.Dispatch<React.SetStateAction<Todo[]>>, setCompletedTodos: React.Dispatch<React.SetStateAction<Todo[]>>) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language.startsWith('zh') ? 'zh' : 'en';

  const newTodos = [
    { id: Date.now(), text: t('sampleSection1'), completed: false, type: 'section' as const },
    ...sampleData[currentLanguage].todos.slice(0, 3).map(todo => ({
      ...todo,
      id: Date.now() + Math.random(),
      type: 'todo' as const
    })),
    { id: Date.now() + 1, text: t('sampleSection2'), completed: false, type: 'section' as const },
    ...sampleData[currentLanguage].todos.slice(3, 6).map(todo => ({
      ...todo,
      id: Date.now() + Math.random(),
      type: 'todo' as const
    })),
    { id: Date.now() + 2, text: t('sampleSection3'), completed: false, type: 'section' as const },
    ...sampleData[currentLanguage].todos.slice(6).map(todo => ({
      ...todo,
      id: Date.now() + Math.random(),
      type: 'todo' as const
    }))
  ];

  const newCompletedTodos = sampleData[currentLanguage].completedTodos.map(todo => ({
    ...todo,
    id: Date.now() + Math.random(),
    type: 'todo' as const
  }));

  setTodos(newTodos);
  setCompletedTodos(newCompletedTodos);

  toast.success(t('sampleDataAdded'), {
    description: t('sampleDataAddedDescription'),
    duration: 1000,
    style: {
      textAlign: 'left',
      justifyContent: 'flex-start',
      fontWeight: 'bold',
    },
  });
};