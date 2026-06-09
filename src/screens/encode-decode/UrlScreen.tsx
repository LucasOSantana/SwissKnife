import { useCallback, useState } from "react";
import { AppCard } from "@/components/app/card/AppCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { URL_MODE_OPTIONS } from "./constants";

export function UrlScreen() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [inputText, setInputText] = useState("");
  const [resultText, setResultText] = useState("");

  const handleCopyResult = useCallback(() => {
    if (!resultText) return;
    copyToClipboard(resultText, "Result copied to clipboard!");
  }, [resultText]);

  const handleProcessUrl = () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text or a URL first.");
      return;
    }

    try {
      const processed =
        mode === "encode"
          ? encodeURIComponent(inputText)
          : decodeURIComponent(inputText);
      setResultText(processed);
    } catch (error) {
      toast.error(
        mode === "encode"
          ? "Error encoding the URL. Please check your input."
          : "Error decoding. The input might not be a valid percent-encoded string."
      );
    }
  };

  return (
    <TooltipProvider>
      <AppCard
        title="URL Encoder / Decoder"
        description="Safely encode or decode strings using RFC 3986 percent-encoding"
        accent={<Link />}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {URL_MODE_OPTIONS.map((item) => {
              const isChecked = mode === item.key;
              return (
                <label
                  key={item.key}
                  htmlFor={item.key}
                  className={`flex h-16 cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors select-none
                    ${isChecked
                      ? "border-primary/50 bg-accent/40 text-accent-foreground"
                      : "bg-card text-muted-foreground hover:bg-accent/20"
                    }`}
                >
                  <Checkbox
                    id={item.key}
                    checked={isChecked}
                    onCheckedChange={() => setMode(item.key as "encode" | "decode")}
                  />
                  <div className="flex flex-col text-left pointer-events-none">
                    <Label
                      htmlFor={item.key}
                      className="text-sm font-medium cursor-pointer leading-none"
                    >
                      {item.label}
                    </Label>
                    <span className="text-[11px] text-muted-foreground mt-1">
                      {item.desc}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="space-y-2">
            <Label htmlFor="input-text" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Source Text / URL
            </Label>
            <Input
              id="input-text"
              type="text"
              placeholder={
                mode === "encode"
                  ? "https://example.com/search?q=hello world"
                  : "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world"
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="h-11 text-sm focus-visible:ring-1"
            />
          </div>

          <Button className="w-full mt-2 h-11" onClick={handleProcessUrl}>
            {mode === "encode" ? "Encode URL" : "Decode URL"}
          </Button>

          {resultText && (
            <div className="space-y-2 pt-2 border-t animate-in fade-in duration-200">
              <div className="flex items-center gap-2 w-full">
                <Label htmlFor="result-text" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Processed Output
                </Label>
                <div className="ml-auto flex items-center gap-2">
                  <Badge variant="default" className="text-[10px] font-bold uppercase">
                    {mode}d
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
