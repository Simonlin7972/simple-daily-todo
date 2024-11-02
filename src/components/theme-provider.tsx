"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

// 定義可用的主題
const themes: Array<string> = ['light', 'dark', 'green-theme'];

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      defaultTheme="light" // 設定默認主題
      themes={themes} // 傳遞可用的主題
    >
      {children}
    </NextThemesProvider>
  )
}
