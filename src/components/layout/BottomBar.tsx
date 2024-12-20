import { Button } from "../ui/button";
import { TimerButton } from "../TimerButton";
import { useTranslation } from 'react-i18next';

export function BottomBar() {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 flex justify-between items-center">
      <div>
        <TimerButton />
      </div>
      <div className="space-x-2">
        <Button variant="outline" id="addDataBtn">{t('addData')}</Button>
        <Button variant="outline" id="resetBtn">{t('reset')}</Button>
      </div>
    </div>
  );
}
