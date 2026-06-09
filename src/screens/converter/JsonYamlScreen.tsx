import { useCallback, useState } from "react";
import { AppCard } from "@/components/app/card/AppCard";
import { Label } from "@/components/ui/label";
import { FileCode, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { JSON_YAML_MODE_OPTIONS } from "./constants";
import yaml from "js-yaml";

type JsonYamlMode = "json-to-yaml" | "yaml-to-json";

export function JsonYamlScreen() {
  const [mode, setMode] = useState<JsonYamlMode>("json-to-yaml");
  const [inputText, setInputText] = useState("");
  const [resultText, setResultText] = useState("");

  const handleCopyResult = useCallback(() => {
    if (!resultText) return;
    copyToClipboard(resultText, "Result copied to clipboard!");
  }, [resultText]);

  const handleConvert = useCallback(() => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to convert.");
      return;
    }

    try {
      if (mode === "json-to-yaml") {
        const obj = JSON.parse(inputText);
        setResultText(yaml.dump(obj));
      } else {
        const obj = yaml.load(inputText);
        setResultText(JSON.stringify(obj, null, 2));
      }
      toast.success("Conversion successful!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error during conversion.");
      setResultText("");
    }
  }, [inputText, mode]);

  return (
    <TooltipProvider>
      <AppCard
        title="JSON ↔ YAML Converter"
        description="Seamlessly convert between JSON and YAML formats"
        accent={<FileCode />}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="conversion-mode" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Conversion Mode
            </Label>
            <Select
              value={mode}
              onValueChange={(value) => setMode(value as JsonYamlMode)}
            >
              <SelectTrigger id="conversion-mode" className="w-full bg-card h-11">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                {JSON_YAML_MODE_OPTIONS.map((item) => (
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
              Source {mode === "json-to-yaml" ? "JSON" : "YAML"}
            </Label>
            <Textarea
              id="input-text"
              placeholder={mode === "json-to-yaml" ? '{\n  "name": "SwissKnife"\n}' : "name: SwissKnife"}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[160px] font-mono text-sm resize-y bg-background focus-visible:ring-1"
            />
          </div>

          <Button className="w-full mt-2 h-11 font-semibold" onClick={handleConvert}>
            Convert to {mode === "json-to-yaml" ? "YAML" : "JSON"}
          </Button>

          {resultText && (
            <div className="space-y-2 pt-4 border-t animate-in fade-in duration-200">
              <div className="flex items-center justify-between w-full">
                <Label htmlFor="output-text" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Result ({mode === "json-to-yaml" ? "YAML" : "JSON"})
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
              <Textarea
                id="output-text"
                value={resultText}
                readOnly
                className="min-h-[160px] font-mono text-sm resize-y bg-muted/40 tracking-wide focus-visible:ring-0 select-all cursor-default"
              />
            </div>
          )}
        </div>
      </AppCard>
    </TooltipProvider>
  );
}
