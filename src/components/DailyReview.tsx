import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Frown, Meh, Smile, Edit2,  } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import useLocalStorage from '../hooks/useLocalStorage';

interface RecapData {
  text: string;
  mood: string;
}

export const DailyReview: React.FC = () => {
  const { t } = useTranslation();
  const [recap, setRecap] = useLocalStorage<RecapData>('dailyRecap', { text: '', mood: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    const savedRecap = localStorage.getItem('dailyRecap');
    if (savedRecap) {
      const parsedRecap = JSON.parse(savedRecap);
      setRecap(parsedRecap);
      setEditedText(parsedRecap.text);
    }
  }, []);

  const MoodIcon = ({ mood, className }: { mood: string; className?: string }) => {
    switch (mood) {
      case 'bad':
        return <Frown size={24} className={className} />;
      case 'neutral':
        return <Meh size={24} className={className} />;
      case 'good':
        return <Smile size={24} className={className} />;
      default:
        return null;
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (recap) {
      const updatedRecap = { ...recap, text: editedText };
      localStorage.setItem('dailyRecap', JSON.stringify(updatedRecap));
      setRecap(updatedRecap);
      setIsEditing(false);
      toast.success(t('recapUpdated'), {
        description: t('recapUpdatedDescription'),
        duration: 2000,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {recap && (
        <Card className="w-full max-w-2xl mx-auto p-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                {t('todaysRecap')}
                <MoodIcon mood={recap.mood} className="ml-2" />
              </CardTitle>
              {!isEditing && (
                <Button variant="ghost" size="icon" onClick={handleEdit}>
                  <Edit2 size={20} />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <>
                <Textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="min-h-[200px] m-2 mb-4"
                />
                <Button onClick={handleSave}>{t('save')}</Button>
              </>
            ) : (
              <p className="whitespace-pre-wrap text-left p-6">{recap.text}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
