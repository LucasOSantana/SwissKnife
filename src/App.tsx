import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/sidebar/AppSidebar";
import { AppHeader } from "@/screens/AppHeader";
import { Router } from "@/pages/Router";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const [activePath, setActivePath] = useState(() => window.location.pathname || "/");
  const [theme, setTheme] = useState<"light" | "dark">(() => {

    const savedTheme = window.localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    if (!document.startViewTransition) {
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.style.colorScheme = theme;
      window.localStorage.setItem("theme", theme);
      return;
    }

    document.startViewTransition(() => {
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.style.colorScheme = theme;
      window.localStorage.setItem("theme", theme);
    });
  }, [theme]);

  function handleNavigate(path: string) {
    setActivePath(path);
    window.history.pushState(null, "", path);
  }

  return (
    <SidebarProvider>
      <AppSidebar activePath={activePath} onNavigate={handleNavigate} />
      <main className="min-h-screen flex-1 bg-background text-foreground">
        <AppHeader
          activePath={activePath}
          theme={theme}
          onToggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
        />
        <Toaster />
        <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 p-6">
          <Router activePath={activePath} />
        </section>
      </main>
    </SidebarProvider>
  );
}

export default App;
