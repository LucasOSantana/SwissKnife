import { useCallback, useState } from "react";
import { AppCard } from "@/components/app/card/AppCard";
import { Label } from "@/components/ui/label";
import { Ruler, Copy } from "lucide-react";
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
import { copyToClipboard } from "@/lib/utils";

const UNITS = {
  length: {
    m: { label: "Meters", ratio: 1 },
    km: { label: "Kilometers", ratio: 1000 },
    mi: { label: "Miles", ratio: 1609.34 },
    ft: { label: "Feet", ratio: 0.3048 },
  },
} as const;

export function UnitScreen() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState<keyof typeof UNITS.length>("m");
  const [toUnit, setToUnit] = useState<keyof typeof UNITS.length>("km");
  const [resultValue, setResultValue] = useState("");

  const handleCopyResult = useCallback(() => {
    if (!resultValue) return;
    const textToCopy = `${resultValue} ${UNITS.length[toUnit].label}`;
    copyToClipboard(textToCopy, "Result copied to clipboard!");
  }, [resultValue, toUnit]);

  const handleConvert = useCallback(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) {
      toast.error("Please enter a valid number.");
      return;
    }

    try {
      const inMeters = val * UNITS.length[fromUnit].ratio;
      const result = inMeters / UNITS.length[toUnit].ratio;
      setResultValue(result.toLocaleString(undefined, { maximumFractionDigits: 6 }));
      toast.success("Units converted!");
    } catch (error) {
      toast.error("Conversion error.");
    }
  }, [inputValue, fromUnit, toUnit]);

  return (
    <TooltipProvider>
      <AppCard
        title="Unit Converter"
        description="Convert between different units of measurement"
        accent={<Ruler />}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">From Unit</Label>
              <Select value={fromUnit} onValueChange={(v) => setFromUnit(v as any)}>
                <SelectTrigger className="bg-card h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(UNITS.length).map(([key, unit]) => (
                    <SelectItem key={key} value={key}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">To Unit</Label>
              <Select value={toUnit} onValueChange={(v) => setToUnit(v as any)}>
                <SelectTrigger className="bg-card h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(UNITS.length).map(([key, unit]) => (
                    <SelectItem key={key} value={key}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit-input" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Value to Convert
            </Label>
            <Input
              id="unit-input"
              type="number"
              placeholder="0.00"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="h-11 text-base bg-card/50"
            />
          </div>

          <Button className="w-full mt-2 h-11" onClick={handleConvert}>
            Convert
          </Button>

          {resultValue && (
            <div className="space-y-2 pt-2 border-t animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Result</Label>
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
              <div className="flex h-11 w-full items-center rounded-md border border-input bg-muted/50 px-3 py-2 text-base font-medium">
                {resultValue} {UNITS.length[toUnit].label}
              </div>
            </div>
          )}
        </div>
      </AppCard>
    </TooltipProvider>
  );
}
