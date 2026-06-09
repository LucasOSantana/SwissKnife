import { useCallback, useState } from "react";
import { AppCard } from "@/components/app/card/AppCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Binary, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Mode = "encode" | "decode";

const BASE64_MODE_OPTIONS = [
  { key: "encode", label: "Encode", desc: "Text -> Base64" },
  { key: "decode", label: "Decode", desc: "Base64 -> Text" },
] as const;

export function Base64Screen() {
  const [mode, setMode] = useState<Mode>("encode");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  const handleProcessText = useCallback(() => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to process.");
      return;
    }

    try {
      if (mode === "encode") {
        const encoded = btoa(encodeURIComponent(inputText).replace(/%([0-9A-F]{2})/g, (_, p1) => {
          return String.fromCharCode(parseInt(p1, 16));
        }));

        setOutputText(encoded);
        toast.success("Text encoded successfully!");

      } else {
        const decoded = decodeURIComponent(atob(inputText).split("").map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(""));

        setOutputText(decoded);
        toast.success("Text decoded successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        mode === "decode" 
          ? "Failed to decode. Please make sure the input is a valid Base64 string." 
          : "An error occurred while processing the text."
      );
    }
  }, [mode, inputText]);

  const handleCopyOutput = useCallback(() => {
    if (!outputText) return;
    copyToClipboard(outputText, "Result copied to clipboard!");
  }, [outputText]);

  const handleClear = useCallback(() => {
    setInputText("");
    setOutputText("");
  }, []);

  return (
    <TooltipProvider>
      <AppCard
        title="Base64 Converter"
        description="Encode or decode text strings to and from Base64 format with UTF-8 support"
        accent={<Binary />}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {BASE64_MODE_OPTIONS.map((item) => {
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
                    onCheckedChange={() => setMode(item.key as Mode)}
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
              {mode === "encode" ? "Input Text (Plain String)" : "Input Base64 Code"}
            </Label>
            <Textarea
              id="input-text"
              placeholder={mode === "encode" ? "Type or paste your text here..." : "Paste your Base64 code here..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[100px] resize-y bg-background focus-visible:ring-1"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button 
              variant="ghost" 
              onClick={handleClear} 
              disabled={!inputText && !outputText}
              className="text-xs h-11"
            >
              Clear
            </Button>
            <Button 
              className="col-span-2 text-xs font-semibold h-11" 
              onClick={handleProcessText}
            >
              {mode === "encode" ? "Encode to Base64" : "Decode Base64"}
            </Button>
          </div>

          {outputText && (
            <div className="space-y-2 pt-4 border-t animate-in fade-in duration-200">
              <div className="flex items-center justify-between w-full">
                <Label htmlFor="output-text" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Result {mode === "encode" ? "(Base64)" : "(Decoded Text)"}
                </Label> 
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyOutput}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy</TooltipContent>
                </Tooltip>
              </div>
              <Textarea
                id="output-text"
                value={outputText}
                readOnly
                className="min-h-[100px] resize-y font-mono bg-muted/40 tracking-wide text-sm focus-visible:ring-0 select-all cursor-default"
              />
            </div>
          )}

        </div>
      </AppCard>
    </TooltipProvider>
  );
}
