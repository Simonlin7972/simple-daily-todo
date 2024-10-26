import { customToast } from "@/components/ui/sonner"

export const SomeComponent = () => {
  const handleSomeAction = () => {
    // 執行某些操作...
    customToast.success("操作成功完成！")
  }

  const handleError = () => {
    customToast.error("發生錯誤，請稍後再試。")
  }

  // ... 組件的其餘部分 ...
}
