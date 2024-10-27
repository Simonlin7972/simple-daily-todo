import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Frown, Meh, Smile, Edit2, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { customToast } from "@/components/ui/sonner";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface RecapData {
  text: string;
  mood: string;
  date: string;
}

interface RecapCardProps {
  recap: RecapData;
  onSave: (updatedRecap: RecapData) => void;
  onDelete: (date: string) => void;
}

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

export const RecapCard: React.FC<RecapCardProps> = ({ recap, onSave, onDelete }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(recap.text);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedRecap = { ...recap, text: editedText };
    onSave(updatedRecap);
    setIsEditing(false);
    customToast.success(t('recapUpdated'), {
      description: t('recapUpdatedDescription'),
    });
  };

  const handleDelete = () => {
    onDelete(recap.date);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-4 mb-4">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CardTitle className="flex items-center">
              {t('todaysRecap')}
              <MoodIcon mood={recap.mood} className="ml-2" />
            </CardTitle>
            <Badge variant="secondary" className="ml-2">{formatDate(recap.date)}</Badge>
          </div>
          <div className="flex space-x-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 size={20} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('deleteRecapConfirmation')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('deleteRecapDescription')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>{t('delete')}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button variant="ghost" size="icon" onClick={handleEdit}>
              <Edit2 size={20} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <>
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="min-h-[200px] m-2 mb-4 mt-8 p-4"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => {
                setIsEditing(false);
                setEditedText(recap.text);
              }}>{t('cancel')}</Button>
              <Button onClick={handleSave}>{t('save')}</Button>
            </div>
          </>
        ) : (
          <p className="whitespace-pre-wrap text-left p-6">{recap.text}</p>
        )}
      </CardContent>
    </Card>
  );
};
