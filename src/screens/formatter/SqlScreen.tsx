import { useCallback, useState } from "react";
import { AppCard } from "@/components/app/card/AppCard";
import { Label } from "@/components/ui/label";
import { Database, AlertTriangle, CheckCircle2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { copyToClipboard } from "@/lib/utils";
import { SQL_MODE_OPTIONS, SQL_DIALECT_OPTIONS } from "./constants";
import { format } from "sql-formatter";

type SqlMode = "prettify" | "minify";

export function SqlScreen() {
  const [mode, setMode] = useState<SqlMode>("prettify");
  const [dialect, setDialect] = useState<string>("sql");
  const [inputText, setInputText] = useState("");
  const [resultText, setResultText] = useState("");
  const [syntaxError, setSyntaxError] = useState<string | null>(null);
  const [isValidated, setIsValidated] = useState(false);

  const handleCopyResult = useCallback(() => {
    if (!resultText) return;
    copyToClipboard(resultText, "Result copied to clipboard!");
  }, [resultText]);

  const handleProcessSql = () => {
    setSyntaxError(null);
    setIsValidated(false);

    if (!inputText.trim()) {
      toast.error("Please enter some SQL text first.");
      return;
    }

    try {
      if (mode === "prettify") {
        const formatted = format(inputText, {
          language: dialect as any,
          tabWidth: 2,
          keywordCase: "upper",
        });
        setResultText(formatted);
      } else {
        const minified = inputText
          .replace(/\/\*[\s\S]*?\*\/|--.*$/gm, "")
          .replace(/\s+/g, " ")
          .trim();
        setResultText(minified);
      }
      
      setIsValidated(true);
      toast.success(`SQL successfully ${mode}d!`);
    } catch (error) {
      if (error instanceof Error) {
        setSyntaxError(error.message);
      } else {
        setSyntaxError("Unknown error occurred during SQL formatting.");
      }
      setResultText("");
      toast.error("Formatting failed. See the error details below.");
    }
  };

  return (
    <TooltipProvider>
      <AppCard
        title="SQL Formatter / Minifier"
        description="Format and compress SQL queries across various dialects"
        accent={<Database />}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sql-mode" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                Action
              </Label>
              <Select
                value={mode}
                onValueChange={(value) => setMode(value as SqlMode)}
              >
                <SelectTrigger id="sql-mode" className="w-full bg-card h-11">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  {SQL_MODE_OPTIONS.map((item) => (
                    <SelectItem key={item.key} value={item.key}>
                      <span className="font-medium">{item.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sql-dialect" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                Dialect
              </Label>
              <Select
                value={dialect}
                onValueChange={(value) => setDialect(value)}
                disabled={mode === "minify"}
              >
                <SelectTrigger id="sql-dialect" className="w-full bg-card h-11">
                  <SelectValue placeholder="Select dialect" />
                </SelectTrigger>
                <SelectContent>
                  {SQL_DIALECT_OPTIONS.map((item) => (
                    <SelectItem key={item.key} value={item.key}>
                      <span className="font-medium">{item.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="input-sql" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Source SQL
            </Label>
            <textarea
              id="input-sql"
              placeholder="SELECT * FROM users WHERE id = 1;"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex min-h-[160px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm font-mono shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
            />
          </div>

          <Button className="w-full mt-2 h-11" onClick={handleProcessSql}>
            Process SQL
          </Button>

          {syntaxError && (
            <div className="flex gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-xs items-start border border-destructive/20 animate-in fade-in duration-200">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">Error Detected:</p>
                <p className="font-mono text-[11px] opacity-90">{syntaxError}</p>
              </div>
            </div>
          )}

          {isValidated && !syntaxError && (
            <div className="flex gap-2 p-3 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs items-center border border-emerald-500/20 animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span className="font-medium">SQL processed successfully!</span>
            </div>
          )}

          {resultText && (
            <div className="space-y-2 pt-2 border-t animate-in fade-in duration-200">
              <div className="flex items-center gap-2 w-full">
                <Label htmlFor="result-sql" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Processed Output
                </Label>
                <div className="ml-auto flex items-center gap-2">
                  <Badge variant="default" className="ml-1 text-[10px] font-bold uppercase">
                    {mode === "prettify" ? "Formatted" : "Minified"}
                  </Badge>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleCopyResult}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <textarea
                id="result-sql"
                value={resultText}
                readOnly
                className="flex min-h-[160px] w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm font-mono shadow-sm text-left focus-visible:outline-none focus-visible:ring-0 select-all cursor-default resize-y"
              />
            </div>
          )}
        </div>
      </AppCard>
    </TooltipProvider>
  );
}
