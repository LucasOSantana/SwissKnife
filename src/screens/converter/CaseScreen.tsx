import { useCallback, useState } from "react";
import { AppCard } from "@/components/app/card/AppCard";
import { Label } from "@/components/ui/label";
import { CaseSensitive, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/utils";
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
import { CASE_MODE_OPTIONS } from "./constants";

type ConversionMode =
  | "camel"
  | "snake"
  | "pascal"
  | "kebab"
  | "upper"
  | "lower"
  | "reverse";

export function CaseScreen() {
  const [mode, setMode] = useState<ConversionMode>("camel");
  const [inputText, setInputText] = useState("");
  const [resultText, setResultText] = useState("");

  const handleCopyResult = useCallback(() => {
    if (!resultText) return;
    copyToClipboard(resultText, "Result copied to clipboard!");
  }, [resultText]);

  const toWords = (str: string) => {
    return str
      .replace(/([A-Z])/g, " $1")
      .replace(/[-_]+/g, " ")
      .trim()
      .split(/\s+/);
  };

  const handleProcessText = useCallback(() => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to convert first.");
      return;
    }

    try {
      let processed = "";
      const words = toWords(inputText);

      switch (mode) {
        case "camel":
          processed = words
            .map((word, index) =>
              index === 0
                ? word.toLowerCase()
                : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join("");
          break;

        case "snake":
          processed = words.map((word) => word.toLowerCase()).join("_");
          break;

        case "pascal":
          processed = words
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join("");
          break;

        case "kebab":
          processed = words.map((word) => word.toLowerCase()).join("-");
          break;

        case "upper":
          processed = inputText.toUpperCase();
          break;

        case "lower":
          processed = inputText.toLowerCase();
          break;

        case "reverse":
          processed = [...inputText].reverse().join("");
          break;

        default:
          processed = inputText;
      }

      setResultText(processed);
    } catch (error) {
      toast.error("Error converting text. Please check your input.");
    }
  }, [inputText, mode]);

  return (
    <TooltipProvider>
      <AppCard
        title="Text Case Converter"
        description="Transform strings between common naming conventions and formats"
        accent={<CaseSensitive />}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="case-mode" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Convert to
            </Label>
            <Select
              value={mode}
              onValueChange={(value) => setMode(value as ConversionMode)}
            >
              <SelectTrigger id="case-mode" className="w-full bg-card h-11">
                <SelectValue placeholder="Select a format" />
              </SelectTrigger>
              <SelectContent>
                {CASE_MODE_OPTIONS.map((item) => (
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
            <Label htmlFor="input-text" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Source Text
            </Label>
            <Input
              id="input-text"
              type="text"
              placeholder="e.g., hello world or hello_world"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="h-11 text-base bg-card/50"
            />
          </div>

          <Button className="w-full mt-2 h-11" onClick={handleProcessText}>
            Convert Text
          </Button>

          {resultText && (
            <div className="space-y-2 pt-2 border-t animate-in fade-in duration-200">
              <div className="flex items-center gap-2 w-full">
                <Label htmlFor="result-text" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Processed Output
                </Label>
                <div className="ml-auto flex items-center gap-1">
                  <Badge variant="default" className="text-[10px] font-bold uppercase">
                    {mode}
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
              <Input
                id="result-text"
                type="text"
                value={resultText}
                readOnly
                className="font-mono bg-muted/50 tracking-wide text-left h-11 text-base focus-visible:ring-0 select-all cursor-default"
              />
            </div>
          )}
        </div>
      </AppCard>
    </TooltipProvider>
  );
}
