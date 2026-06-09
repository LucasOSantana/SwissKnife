import { useCallback, useState } from "react";
import { AppCard } from "@/components/app/card/AppCard";
import { AppSlider } from "@/components/app/slider/AppSlider";
import { Label } from "@/components/ui/label";
import { TextCursorInput, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { LOREM_PARAGRAPHS } from "./constants";
import { copyToClipboard } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function LoremScreen() {
  const [paragraphCount, setParagraphCount] = useState(3);
  const [generatedText, setGeneratedText] = useState("");

  const handleCopyLorem = useCallback(() => {
    if (!generatedText) return;
    copyToClipboard(generatedText, "Lorem ipsum text copied to clipboard!");
  }, [generatedText]);

  const handleGenerateLorem = () => {
    const shuffled = [...LOREM_PARAGRAPHS];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const result: string[] = [];
    for (let i = 0; i < paragraphCount; i++) {
      result.push(shuffled[i % shuffled.length]);
    }

    setGeneratedText(result.join("\n\n"));
  };

  return (
    <TooltipProvider>
      <AppCard
        title="Lorem Ipsum Generator"
        description="Generate placeholder texts for your layouts and designs"
        accent={<TextCursorInput />}
      >
        <div className="space-y-6">

          <div className="flex items-end gap-3">
            <div className="grid flex-1 gap-2">
              <AppSlider
                value={[paragraphCount]}
                onValueChange={([value]) => setParagraphCount(value)}
                max={10}
                min={1}
                step={1}
                label="Paragraphs"
              />
            </div>
            
            <div className="flex h-11 flex-col justify-center rounded-md border bg-popover px-3 py-1 text-right min-w-[80px]">
              <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">Qty</span>
              <span className="text-xs font-semibold text-foreground font-mono">
                {paragraphCount} {paragraphCount === 1 ? "para." : "paras."}
              </span>
            </div>
          </div>

          <Button className="w-full mt-2 h-11" onClick={handleGenerateLorem}>
            Generate Text
          </Button>

          {generatedText && (
            <div 
              className="space-y-2 pt-2 border-t animate-in fade-in duration-200"
            >
              <div className="flex items-center gap-2 w-full">
                <Label htmlFor="result-lorem" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Generated Text
                </Label> 
                <div className="ml-auto flex items-center gap-2">
                  <Badge variant="default" className="text-[10px] font-bold uppercase">
                    {paragraphCount} {paragraphCount === 1 ? "PARAGRAPH" : "PARAGRAPHS"}
                  </Badge>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyLorem}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              <Textarea
                id="result-lorem"
                value={generatedText}
                readOnly
                className="min-h-[160px] max-h-[280px] font-sans bg-muted/50 tracking-wide text-sm leading-relaxed focus-visible:ring-0 select-all cursor-default resize-none"
              />
            </div>
          )}

        </div>
      </AppCard>
    </TooltipProvider>
  );
}
