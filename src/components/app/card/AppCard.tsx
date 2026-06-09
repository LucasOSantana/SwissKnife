import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ScreenShellProps = {
  title: string;
  description: string;
  accent?: React.ReactNode;
  children?: React.ReactNode;
};

export function AppCard({ title, description, accent, children }: ScreenShellProps) {
  return (
    <Card className="border-border bg-card text-card-foreground shadow-xl">
        {title && (
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              {accent} 
              <span>{title}</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground">{description}</CardDescription>
          </CardHeader>
        )}
      <CardContent className="space-y-4 text-foreground">
        {children}
      </CardContent>
    </Card>
  );
}
