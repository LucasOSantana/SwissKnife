import { useCallback, useState } from "react";
import { AppCard } from "@/components/app/card/AppCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Fingerprint, Copy } from "lucide-react";
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
import { uuidv7 } from "uuidv7";

export function UuidScreen() {
  const [uuidType, setUuidType] = useState<"v4" | "v7">("v4");
  const [generatedUuid, setGeneratedUuid] = useState("");

  const handleCopyUuid = useCallback(() => {
    if (!generatedUuid) return;
    copyToClipboard(generatedUuid, "UUID copied to clipboard!");
  }, [generatedUuid]);

  const handleGenerateUuid = () => {
    try {
      const result = uuidType === "v4" ? crypto.randomUUID() : uuidv7();
      setGeneratedUuid(result);
    } catch (error) {
      toast.error("Error generating UUID. Please try again.");
    }
  };

  return (
    <TooltipProvider>
      <AppCard
        title="UUID Generator"
        description="Generate unique universal identifiers in v4 or v7 formats"
        accent={<Fingerprint />}
      >
        <div className="space-y-6">
          
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "v4", label: "UUID v4", desc: "Random" },
              { key: "v7", label: "UUID v7", desc: "Time-based" },
            ].map((item) => {
              const isChecked = uuidType === item.key;
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
                    onCheckedChange={() => setUuidType(item.key as "v4" | "v7")}
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

          <Button className="w-full mt-2 h-11" onClick={handleGenerateUuid}>
            Generate UUID
          </Button>

          {generatedUuid && (
            <div className="space-y-2 pt-2 border-t animate-in fade-in duration-200">
              <div className="flex items-center gap-2 w-full">
                <Label htmlFor="result-uuid" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Generated UUID
                </Label> 
                <div className="ml-auto flex items-center gap-2">
                  <Badge variant="default" className="text-[10px] font-bold uppercase">
                    {uuidType}
                  </Badge>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyUuid}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <Input
                id="result-uuid"
                type="text"
                value={generatedUuid}
                readOnly
                className="font-mono bg-muted/50 tracking-wide text-center h-11 text-base focus-visible:ring-0 select-all cursor-default"
              />
            </div>
          )}

        </div>
      </AppCard>
    </TooltipProvider>
  );
}
