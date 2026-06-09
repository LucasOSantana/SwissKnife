import { useCallback, useState } from "react";
import { AppCard } from "@/components/app/card/AppCard";
import { Label } from "@/components/ui/label";
import { Calendar, Copy, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { DATE_MODE_OPTIONS } from "./constants";

type DateMode = "date-to-unix" | "unix-to-date";

export function DateScreen() {
  const [mode, setMode] = useState<DateMode>("date-to-unix");
  const [inputText, setInputText] = useState("");
  const [resultText, setResultText] = useState("");

  const handleCopyResult = useCallback(() => {
    if (!resultText) return;
    copyToClipboard(resultText, "Result copied to clipboard!");
  }, [resultText]);

  const handleConvert = useCallback(() => {
    if (!inputText.trim()) {
      toast.error("Please enter a value to convert.");
      return;
    }

    try {
      if (mode === "date-to-unix") {
        const date = new Date(inputText);
        if (isNaN(date.getTime())) {
          throw new Error("Invalid date format. Use YYYY-MM-DD HH:mm:ss");
        }
        setResultText(Math.floor(date.getTime() / 1000).toString());
      } else {
        const unix = parseInt(inputText);
        if (isNaN(unix)) {
          throw new Error("Invalid Unix Epoch. Please enter a number.");
        }
        const date = new Date(unix * 1000);
        setResultText(date.toISOString().replace("T", " ").replace(/\..+/, ""));
      }
      toast.success("Conversion successful!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error during conversion.");
      setResultText("");
    }
  }, [inputText, mode]);

  const handleSetCurrent = () => {
    if (mode === "date-to-unix") {
      setInputText(new Date().toISOString().replace("T", " ").replace(/\..+/, ""));
    } else {
      setInputText(Math.floor(Date.now() / 1000).toString());
    }
  };

  return (
    <TooltipProvider>
      <AppCard
        title="Date ↔ Unix Epoch Converter"
        description="Convert human-readable dates to Unix timestamps and vice-versa"
        accent={<Calendar />}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date-mode" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Conversion Mode
            </Label>
            <Select
              value={mode}
              onValueChange={(value) => setMode(value as DateMode)}
            >
              <SelectTrigger id="date-mode" className="w-full bg-card h-11">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                {DATE_MODE_OPTIONS.map((item) => (
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
            <div className="flex items-center justify-between">
              <Label htmlFor="input-text" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                {mode === "date-to-unix" ? "Date / Time (ISO or Local)" : "Unix Epoch (Seconds)"}
              </Label>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-[10px] uppercase font-bold px-2 gap-1.5"
                onClick={handleSetCurrent}
              >
                <Clock className="h-3 w-3" />
                Current
              </Button>
            </div>
            <Input
              id="input-text"
              placeholder={mode === "date-to-unix" ? "2026-06-08 14:30:00" : "1780939588"}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="h-11 text-base bg-background focus-visible:ring-1 font-mono"
            />
          </div>

          <Button className="w-full mt-2 h-11 font-semibold" onClick={handleConvert}>
            Convert to {mode === "date-to-unix" ? "Unix Epoch" : "Human Date"}
          </Button>

          {resultText && (
            <div className="space-y-2 pt-4 border-t animate-in fade-in duration-200">
              <div className="flex items-center justify-between w-full">
                <Label htmlFor="output-text" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Result ({mode === "date-to-unix" ? "Unix Epoch" : "Date String"})
                </Label> 
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyResult}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy</TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="output-text"
                value={resultText}
                readOnly
                className="h-11 font-mono text-base bg-muted/40 tracking-wide focus-visible:ring-0 select-all cursor-default"
              />
            </div>
          )}
        </div>
      </AppCard>
    </TooltipProvider>
  );
}
