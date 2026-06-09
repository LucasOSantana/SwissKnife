import { useCallback, useState } from "react";
import { AppCard } from "@/components/app/card/AppCard";
import { Label } from "@/components/ui/label";
import { Binary, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { NUMBER_BASE_OPTIONS } from "./constants";
import { copyToClipboard } from "@/lib/utils";

export function NumberBaseScreen() {
  const [fromBase, setFromBase] = useState<string>("10");
  const [toBase, setToBase] = useState<string>("16");
  const [inputValue, setInputValue] = useState("");
  const [resultValue, setResultValue] = useState("");

  const handleCopyResult = useCallback(() => {
    if (!resultValue) return;
    copyToClipboard(resultValue, "Result copied to clipboard!");
  }, [resultValue]);

  const handleConvert = useCallback(() => {
    if (!inputValue.trim()) {
      toast.error("Please enter a number to convert.");
      return;
    }

    try {
      const parsed = parseInt(inputValue, parseInt(fromBase));
      if (isNaN(parsed)) {
        throw new Error("Invalid number for the selected base.");
      }
      setResultValue(parsed.toString(parseInt(toBase)).toUpperCase());
      toast.success("Conversion successful!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error converting number.");
      setResultValue("");
    }
  }, [inputValue, fromBase, toBase]);

  return (
    <TooltipProvider>
      <AppCard
        title="Number Base Converter"
        description="Convert numbers between binary, octal, decimal, and hexadecimal"
        accent={<Binary />}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">From Base</Label>
              <Select value={fromBase} onValueChange={setFromBase}>
                <SelectTrigger className="bg-card h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NUMBER_BASE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">To Base</Label>
              <Select value={toBase} onValueChange={setToBase}>
                <SelectTrigger className="bg-card h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NUMBER_BASE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="input-number" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Number to Convert
            </Label>
            <Input
              id="input-number"
              type="text"
              placeholder={`Enter a base ${fromBase} number`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="font-mono h-11 text-base bg-card/50"
            />
          </div>

          <Button className="w-full mt-2 h-11" onClick={handleConvert}>
            Convert
          </Button>

          {resultValue && (
            <div className="space-y-2 pt-2 border-t animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Result (Base {toBase})</Label>
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
              <Input
                value={resultValue}
                readOnly
                className="font-mono bg-muted/50 h-11 text-base select-all cursor-default"
              />
            </div>
          )}
        </div>
      </AppCard>
    </TooltipProvider>
  );
}
