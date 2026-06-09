import { useCallback, useState, useMemo } from "react";
import { AppCard } from "@/components/app/card/AppCard";
import { Label } from "@/components/ui/label";
import { Fingerprint, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { copyToClipboard } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CryptoJS from "crypto-js";

export function HashScreen() {
  const [inputText, setInputText] = useState("");

  const hashes = useMemo(() => {
    if (!inputText) return { md5: "", sha1: "", sha256: "", sha512: "" };
    
    return {
      md5: CryptoJS.MD5(inputText).toString(),
      sha1: CryptoJS.SHA1(inputText).toString(),
      sha256: CryptoJS.SHA256(inputText).toString(),
      sha512: CryptoJS.SHA512(inputText).toString(),
    };
  }, [inputText]);

  const handleCopyHash = (val: string, label: string) => {
    if (!val) return;
    copyToClipboard(val, `${label} hash copied to clipboard!`);
  };

  return (
    <TooltipProvider>
      <AppCard
        title="Hash Generator"
        description="Compute MD5, SHA-1, SHA-256 and SHA-512 fingerprints for your text"
        accent={<Fingerprint />}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="input-text" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Input Text
            </Label>
            <Textarea
              id="input-text"
              placeholder="Type or paste text to generate hashes..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[120px] font-sans text-sm resize-y bg-background focus-visible:ring-1"
            />
          </div>

          <div className="space-y-4 pt-4 border-t animate-in fade-in duration-200">
            {[
              { label: "MD5", value: hashes.md5 },
              { label: "SHA-1", value: hashes.sha1 },
              { label: "SHA-256", value: hashes.sha256 },
              { label: "SHA-512", value: hashes.sha512 },
            ].map((hash) => (
              <div key={hash.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{hash.label}</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => handleCopyHash(hash.value, hash.label)}
                        disabled={!hash.value}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy</TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  value={hash.value}
                  readOnly
                  placeholder={`${hash.label} hash will appear here...`}
                  className="h-11 font-mono text-xs bg-muted/40 tracking-tight focus-visible:ring-0 select-all cursor-default"
                />
              </div>
            ))}
          </div>
        </div>
      </AppCard>
    </TooltipProvider>
  );
}
