import { useCallback, useState } from "react";
import { AppCard } from "@/components/app/card/AppCard";
import { Label } from "@/components/ui/label";
import { Braces, AlertTriangle, CheckCircle2, Copy } from "lucide-react";
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
import { JSON_MODE_OPTIONS } from "./constants";

type JsonMode = "prettify" | "minify";

export function JsonScreen() {
  const [mode, setMode] = useState<JsonMode>("prettify");
  const [inputText, setInputText] = useState("");
  const [resultText, setResultText] = useState("");
  const [syntaxError, setSyntaxError] = useState<string | null>(null);
  const [isValidated, setIsValidated] = useState(false);

  const handleCopyResult = useCallback(() => {
    if (!resultText) return;
    copyToClipboard(resultText, "Result copied to clipboard!");
  }, [resultText]);

  const handleProcessJson = () => {
    setSyntaxError(null);
    setIsValidated(false);

    if (!inputText.trim()) {
      toast.error("Please enter some JSON text first.");
      return;
    }

    try {
      const parsedJson = JSON.parse(inputText);

      setIsValidated(true);

      if (mode === "prettify") {
        setResultText(JSON.stringify(parsedJson, null, 2));
      } else {
        setResultText(JSON.stringify(parsedJson));
      }
      
      toast.success(`JSON successfully ${mode}d!`);
    } catch (error) {
      if (error instanceof Error) {
        setSyntaxError(error.message);
      } else {
        setSyntaxError("Unknown syntax error occurred.");
      }
      setResultText("");
      toast.error("Invalid JSON syntax. See the error details below.");
    }
  };

  return (
    <TooltipProvider>
      <AppCard
        title="JSON Minifier / Prettifier"
        description="Format, validate syntax, and compress JSON payloads safely"
        accent={<Braces />}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="json-mode" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Action
            </Label>
            <Select
              value={mode}
              onValueChange={(value) => setMode(value as JsonMode)}
            >
              <SelectTrigger id="json-mode" className="w-full bg-card h-11">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                {JSON_MODE_OPTIONS.map((item) => (
                  <SelectItem key={item.key} value={item.key}>
                    <span className="font-medium mr-2">{item.label}</span>
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      — {item.desc}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="input-json" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Source JSON
            </Label>
            <textarea
              id="input-json"
              placeholder='{\n  "name": "John Doe",\n  "age": 30\n}'
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex min-h-[160px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm font-mono shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
            />
          </div>

          <Button className="w-full mt-2 h-11" onClick={handleProcessJson}>
            Process JSON
          </Button>

          {syntaxError && (
            <div className="flex gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-xs items-start border border-destructive/20 animate-in fade-in duration-200">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">Syntax Error Detected:</p>
                <p className="font-mono text-[11px] opacity-90">{syntaxError}</p>
              </div>
            </div>
          )}

          {isValidated && !syntaxError && (
            <div className="flex gap-2 p-3 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs items-center border border-emerald-500/20 animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span className="font-medium">JSON is secure and syntactically valid!</span>
            </div>
          )}

          {resultText && (
            <div className="space-y-2 pt-2 border-t animate-in fade-in duration-200">
              <div className="flex items-center gap-2 w-full">
                <Label htmlFor="result-json" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Processed Output
                </Label>
                <div className="ml-auto flex items-center gap-2">
                  <Badge variant="default" className="text-[10px] font-bold uppercase">
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
                id="result-json"
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
