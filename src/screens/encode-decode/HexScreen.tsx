import { useCallback, useState } from "react";
import { AppCard } from "@/components/app/card/AppCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Hash, Copy } from "lucide-react";
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
import { HEX_MODE_OPTIONS } from "./constants";

export function HexScreen() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [inputText, setInputText] = useState("");
  const [resultText, setResultText] = useState("");

  const handleCopyResult = useCallback(() => {
    if (!resultText) return;
    copyToClipboard(resultText, "Result copied to clipboard!");
  }, [resultText]);

  const handleProcessHex = () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text or hex string first.");
      return;
    }

    try {
      if (mode === "encode") {
        const encoder = new TextEncoder();
        const data = encoder.encode(inputText);
        const hex = Array.from(data)
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join("");
        
        setResultText(hex);
      } else {
        const cleanHex = inputText.replace(/\s+/g, "");

        if (!/^[0-9a-fA-F]+$/.test(cleanHex)) {
          throw new Error("Invalid hex characters");
        }

        if (cleanHex.length % 2 !== 0) {
          throw new Error("Hex string must have an even length");
        }

        const bytes = new Uint8Array(
          cleanHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
        );
        const decoder = new TextDecoder();
        
        setResultText(decoder.decode(bytes));
      }
    } catch (error) {
      toast.error(
        mode === "encode"
          ? "Error encoding the text. Please check your input."
          : "Error decoding. The input might not be a valid hexadecimal string."
      );
    }
  };

  return (
    <TooltipProvider>
      <AppCard
        title="HEX Encoder / Decoder"
        description="Safely encode plain text to hex or decode hex back to readable text"
        accent={<Hash />}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {HEX_MODE_OPTIONS.map((item) => {
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
              Source Text / HEX
            </Label>
            <Input
              id="input-text"
              type="text"
              placeholder={
                mode === "encode"
                  ? "Hello World"
                  : "48656c6c6f20576f726c64"
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="h-11 text-sm focus-visible:ring-1"
            />
          </div>

          <Button className="w-full mt-2 h-11" onClick={handleProcessHex}>
            {mode === "encode" ? "Encode to HEX" : "Decode HEX"}
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
