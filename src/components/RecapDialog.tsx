import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from 'sonner';
import { CheckCircle2, Frown, Meh, Smile } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface RecapDialogProps {
  completedTodos: { text: string }[];
  onSaveRecap: (recap: string, mood: string) => void;
}

export const RecapDialog: React.FC<RecapDialogProps> = ({ completedTodos, onSaveRecap }) => {
  const { t } = useTranslation();
  const [recap, setRecap] = useState('');
  const [mood, setMood] = useState<string | null>(null);

  useEffect(() => {
    setRecap(completedTodos.map(todo => `- ${todo.text}`).join('\n'));
  }, [completedTodos]);

  const handleSaveRecap = () => {
    if (mood && recap.trim()) {
      onSaveRecap(recap, mood);
      toast.success(t('recapSaved'), {
        description: t('recapSavedDescription'),
        duration: 1000,
        style: {
          textAlign: 'left',
          justifyContent: 'flex-start',
          fontWeight: 'bold',
        },
      });
    } else {
      toast.error(t('pleaseSelectMood'), {
        description: t('moodSelectionRequired'),
        duration: 1000,
      });
    }
  };

  const MoodButton: React.FC<{ icon: React.ReactNode, moodType: string, text: string, selected: boolean }> = ({ icon, moodType, text, selected }) => (
    <Button
      variant={selected ? "default" : "outline"}
      className={`flex flex-col items-center justify-center space-y-2 w-full h-20 ${selected ? 'bg-primary text-primary-foreground' : ''}`}
      onClick={() => setMood(moodType)}
    >
      {icon}
      <span>{text}</span>
    </Button>
  );

  const isSaveDisabled = !recap.trim() || !mood;

  // 獲取今天的日期
  const today = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex justify-center ml-4">
          <Button className="w-full mt-4 h-12 font-bold">{t('todaysRecap')}</Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] p-8">
        <DialogHeader>
          <div className="flex items-center mb-2">
            <DialogTitle className='text-xl mr-2'>{t('todaysRecap')}</DialogTitle>
            <Badge variant="secondary">{today}</Badge>
          </div>
          <DialogDescription>
            {t('recapDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-0">
          <Textarea
            value={recap}
            onChange={(e) => setRecap(e.target.value)}
            className="h-[200px]"
            placeholder={t('recapPlaceholder')}
          />
          <div className="grid grid-cols-3 gap-4 mt-2 mb-2">
            <MoodButton icon={<Frown size={28} />} moodType="bad" text={t('badMood')} selected={mood === "bad"} />
            <MoodButton icon={<Meh size={28} />} moodType="neutral" text={t('neutralMood')} selected={mood === "neutral"} />
            <MoodButton icon={<Smile size={28} />} moodType="good" text={t('goodMood')} selected={mood === "good"} />
          </div>
          <Button 
            onClick={handleSaveRecap} 
            className="w-full h-12 font-bold" 
            id="saveRecapBtn"
            disabled={isSaveDisabled}
          >
            {t('saveRecap')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
