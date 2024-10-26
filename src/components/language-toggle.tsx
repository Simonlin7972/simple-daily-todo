import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { useTranslation } from 'react-i18next'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface LanguageToggleProps {
  isMobile?: boolean;
}

export function LanguageToggle({ isMobile = false }: LanguageToggleProps) {
  const { i18n, t } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en'
    i18n.changeLanguage(newLang)
  }

  const buttonContent = (
    <>
      <Globe className="h-[1rem] w-[1rem]" />
      <span>{i18n.language === 'en' ? 'EN' : '繁中'}</span>
    </>
  )

  const button = (
    <Button 
      variant="outline" 
      onClick={toggleLanguage} 
      className={`flex items-center space-x-2 ${isMobile ? 'w-full justify-center' : 'w-auto h-10 px-3'}`}
    >
      {buttonContent}
    </Button>
  )

  if (isMobile) {
    return button
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {button}
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('toggleLanguage')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
