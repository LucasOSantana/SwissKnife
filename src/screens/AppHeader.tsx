import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import sidebarConfig from "@/components/app/sidebar/sidebar.json";
import {
  Sun,
  Moon
} from "lucide-react"

type AppHeaderProps = {
  activePath: string;
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

export function AppHeader({ activePath, theme, onToggleTheme }: AppHeaderProps) {
  const title = useMemo(() => {
    const items = [
      ...Object.values(sidebarConfig.modules as Record<string, { name?: string; path?: string; children?: Array<{ name?: string; path?: string }> }>),
      ...Object.values(sidebarConfig.projects as Record<string, { name?: string; path?: string; children?: Array<{ name?: string; path?: string }> }>),
    ];

    const directMatch = items.find((item) => item.path === activePath);
    if (directMatch?.name) return directMatch.name;

    for (const item of items) {
      const childMatch = item.children?.find((child) => child.path === activePath);
      if (childMatch?.name) return childMatch.name;
    }

    return "SwissKnife";
  }, [activePath]);

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-foreground" />
          <span className="text-lg font-semibold tracking-wide text-foreground">{title}</span>
        </div>

        <Button type="button" variant="outline" size="sm" onClick={onToggleTheme}>
            {
                theme === "dark" ? (
                    <>
                    <Sun className="size-4" />Light
                    </>
                ) : (
                    <>
                    <Moon className="size-4" />Dark
                    </>
                )
            }
        </Button>
      </div>
    </header>
  );
}
