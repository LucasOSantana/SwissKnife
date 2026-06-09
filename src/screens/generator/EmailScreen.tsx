import { useCallback, useState } from "react";
import { AppCard } from "@/components/app/card/AppCard";
import { Label } from "@/components/ui/label";
import { Mail, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EMAIL_TONE_OPTIONS, EMAIL_TEMPLATES } from "./constants";

type EmailTone = "professional" | "casual" | "urgent";

export function EmailScreen() {
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState<EmailTone>("professional");
  const [generatedEmail, setGeneratedEmail] = useState("");

  const handleCopyEmail = useCallback(() => {
    if (!generatedEmail) return;
    copyToClipboard(generatedEmail, "Email template copied to clipboard!");
  }, [generatedEmail]);

  const handleGenerateEmail = () => {
    if (!subject.trim()) {
      toast.error("Please enter a subject or main topic.");
      return;
    }

    const template = EMAIL_TEMPLATES[tone]
      .replace(/\{\{subject\}\}/g, subject)
      .replace(/\{\{subjectLower\}\}/g, subject.toLowerCase());

    setGeneratedEmail(template);
  };

  return (
    <TooltipProvider>
      <AppCard
        title="Email Generator"
        description="Quickly draft contextual placeholders for email templates"
        accent={<Mail />}
      >
        <div className="space-y-6">
          
          <div className="grid gap-2">
            <Label htmlFor="email-subject" className="text-sm font-medium uppercase font-bold tracking-wider">
              Main Topic / Subject
            </Label>
            <Input
              id="email-subject"
              type="text"
              placeholder="e.g., Project Kickoff, Rescheduling meeting"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-11 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium uppercase font-bold tracking-wider">Email Tone</Label>
            <div className="grid grid-cols-3 gap-2">
              {EMAIL_TONE_OPTIONS.map((type) => {
                const isSelected = tone === type;
                return (
                  <Button
                    key={type}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => setTone(type)}
                    className="h-11 text-xs capitalize font-medium transition-all"
                  >
                    {type}
                  </Button>
                );
              })}
            </div>
          </div>

          <Button className="w-full mt-2 h-11" onClick={handleGenerateEmail}>
            Generate Email
          </Button>

          {generatedEmail && (
            <div 
              className="space-y-2 pt-2 border-t animate-in fade-in duration-200"
            >
              <div className="flex items-center gap-2 w-full">
                <Label htmlFor="result-email" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Generated Email Template
                </Label> 
                <div className="ml-auto flex items-center gap-2">
                  <Badge variant="default" className="text-[10px] font-bold uppercase">
                    {tone}
                  </Badge>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyEmail}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              <Textarea
                id="result-email"
                value={generatedEmail}
                readOnly
                className="min-h-[200px] max-h-[320px] font-sans bg-muted/50 tracking-wide text-sm leading-relaxed focus-visible:ring-0 select-all cursor-default resize-none"
              />
            </div>
          )}

        </div>
      </AppCard>
    </TooltipProvider>
  );
}
