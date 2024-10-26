import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
        duration: 1000, // 設置默認持續時間為 1 秒
      }}
      {...props}
    />
  )
}

// 自定義 toast 函數
const customToast = {
  success: (message: string, options = {}) => 
    toast.success(message, { duration: 1000, ...options }),
  error: (message: string, options = {}) => 
    toast.error(message, { duration: 1000, ...options }),
  info: (message: string, options = {}) => 
    toast(message, { duration: 1000, ...options }),
  warning: (message: string, options = {}) => 
    toast.warning(message, { duration: 1000, ...options }),
}

export { Toaster, customToast }
