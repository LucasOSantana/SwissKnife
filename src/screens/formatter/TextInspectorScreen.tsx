import { useCallback, useState, useMemo } from "react";
import { AppCard } from "@/components/app/card/AppCard";
import { Label } from "@/components/ui/label";
import { SearchCode, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { copyToClipboard } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function TextInspectorScreen() {
  const [inputText, setInputText] = useState("");

  const stats = useMemo(() => {
    const text = inputText || "";
    const characters = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
    const bytes = new TextEncoder().encode(text).length;

    const freq: Record<string, number> = {};
    const cleanText = text.toLowerCase().replace(/[^a-z0-9]/g, "");
    for (const char of cleanText) {
      freq[char] = (freq[char] || 0) + 1;
    }

    const sortedFreq = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return { characters, words, lines, bytes, sortedFreq };
  }, [inputText]);

  const handleCopyStat = (val: number | string, label: string) => {
    copyToClipboard(val.toString(), `${label} copied to clipboard!`);
  };

  return (
    <TooltipProvider>
      <AppCard
        title="Text Inspector"
        description="Analyze text statistics, word counts, and character frequency"
        accent={<SearchCode />}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="input-text" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Input Text
            </Label>
            <Textarea
              id="input-text"
              placeholder="Paste or type your text here to analyze..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[160px] font-sans text-sm resize-y bg-background focus-visible:ring-1"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Characters", value: stats.characters },
              { label: "Words", value: stats.words },
              { label: "Lines", value: stats.lines },
              { label: "Bytes", value: stats.bytes },
            ].map((stat) => (
              <div key={stat.label} className="p-3 rounded-lg border bg-muted/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{stat.label}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => handleCopyStat(stat.value, stat.label)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy</TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-xl font-mono font-bold leading-none">{stat.value}</p>
              </div>
            ))}
          </div>

          {stats.sortedFreq.length > 0 && (
            <div className="space-y-3 pt-4 border-t animate-in fade-in duration-200">
              <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                Top Character Frequency
              </Label>
              <div className="flex flex-wrap gap-2">
                {stats.sortedFreq.map(([char, count]) => (
                  <Badge key={char} variant="secondary" className="h-8 px-3 gap-2 font-mono text-sm">
                    <span className="text-primary font-bold uppercase">{char}</span>
                    <span className="text-muted-foreground text-xs">{count}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </AppCard>
    </TooltipProvider>
  );
}
