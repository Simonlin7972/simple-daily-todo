import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslation } from 'react-i18next'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ModeToggleProps {
  isMobile?: boolean;
}

export function ModeToggle({ isMobile = false }: ModeToggleProps) {
  const [mounted, setMounted] = useState(false)
  const { setTheme, theme } = useTheme()
  const { t } = useTranslation()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const toggleButton = (
    <Button variant="outline" size="icon" className={isMobile ? "w-full justify-center h-10" : "w-10 h-10"}>
      <Sun className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      {isMobile && <span className="ml-2">{t('toggleTheme')}</span>}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )

  const dropdown = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {toggleButton}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isMobile ? "center" : "end"}>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          {t('themeLight')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          {t('themeDark')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          {t('themeSystem')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  if (isMobile) {
    return dropdown
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {dropdown}
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('toggleTheme')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
