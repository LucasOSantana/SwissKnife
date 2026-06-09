import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ScreenShellProps = {
  title: string;
  description: string;
  path: string;
  accent?: string;
  children?: React.ReactNode;
};

export function ScreenShell({ title, description, path, accent = "🧰", children }: ScreenShellProps) {
  return (
    <Card className="border-border bg-card text-card-foreground shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">{accent} {title}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-foreground">
        <p className="text-sm text-muted-foreground">Rota ativa: <span className="font-mono text-blue-400">{path}</span></p>
        {children}
      </CardContent>
    </Card>
  );
}
