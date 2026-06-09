import { useCallback, useState } from "react";
import { AppCard } from "@/components/app/card/AppCard";
import { Checkbox } from "@/components/ui/checkbox";
import { AppSlider } from "@/components/app/slider/AppSlider";
import { Label } from "@/components/ui/label";
import { Shield, Copy } from "lucide-react";
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
import { PASSWORD_CHAR_SETS, PASSWORD_OPTION_ITEMS } from "./constants";

export function PasswordScreen() {
  const [passwordLength, setPasswordLength] = useState(12);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [strength, setPasswordStrength] = useState<{
     label: string; 
     variant: "success" | "warning" | "destructive" | "light_success" } | null
  >(null);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const toggleOption = (key: keyof typeof options) => {
    setOptions((current) => ({ ...current, [key]: !current[key] }));
  };

  const getPasswordStrength = (currentPassword: string) => {
    if (!currentPassword) return null;
    
    const activeOptionsCount = Object.values(options).filter(Boolean).length;
    const len = currentPassword.length;

    if (len < 8 || activeOptionsCount <= 1) {
      return { label: "Weak", variant: "destructive" as const };
    }
    if (len >= 16 && activeOptionsCount === 4) {
      return { label: "Very Strong", variant: "success" as const };
    }
    if (len >= 12 && activeOptionsCount >= 3) {
      return { label: "Strong", variant: "light_success" as const };
    }

    return { label: "Medium", variant: "warning" as const };
  };

  const handleCopyPassword = useCallback(() => {
    if (!generatedPassword) return;
    copyToClipboard(generatedPassword, "Password copied to clipboard!");
  }, [generatedPassword]);

  const handleGeneratePassword = () => {
    let availableChars = "";
    if (options.uppercase) availableChars += PASSWORD_CHAR_SETS.uppercase;
    if (options.lowercase) availableChars += PASSWORD_CHAR_SETS.lowercase;
    if (options.numbers) availableChars += PASSWORD_CHAR_SETS.numbers;
    if (options.symbols) availableChars += PASSWORD_CHAR_SETS.symbols;

    if (!availableChars) {
      toast.error("Please select at least one character type.");
      return;
    }

    let result = "";
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * availableChars.length);
      result += availableChars[randomIndex];
    }

    setGeneratedPassword(result);
    setPasswordStrength(getPasswordStrength(result));
  };

  return (
    <TooltipProvider>
      <AppCard
        title="Password Generator"
        description="Setup your own parameters to create a password"
        accent={<Shield />}
      >
        <div className="space-y-6">
          
          <div className="flex items-end gap-3">
            <div className="grid flex-1 gap-2">
              <AppSlider
                value={[passwordLength]}
                onValueChange={([value]) => setPasswordLength(value)}
                max={32}
                min={5}
                step={1}
                label="Length"
              />
            </div>
            
            <div className="flex h-11 flex-col justify-center rounded-md border bg-popover px-3 py-1 text-right min-w-[80px]">
              <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">Selected</span>
              <span className="text-xs font-semibold text-foreground font-mono">{passwordLength} chrs</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PASSWORD_OPTION_ITEMS.map((item) => {
              const isChecked = options[item.key as keyof typeof options];
              return (
                <label
                  key={item.key}
                  htmlFor={item.key}
                  className={`flex h-12 cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors select-none
                    ${isChecked 
                      ? "border-primary/50 bg-accent/40 text-accent-foreground" 
                      : "bg-card text-muted-foreground hover:bg-accent/20"
                    }`}
                >
                  <Checkbox
                    id={item.key}
                    checked={isChecked}
                    onCheckedChange={() => toggleOption(item.key as keyof typeof options)}
                  />
                  <Label
                    htmlFor={item.key}
                    className="text-sm font-medium cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {item.label}
                  </Label>
                </label>
              );
            })}
            
            <Button className="col-span-full mt-2 h-11" onClick={handleGeneratePassword}>
              Generate Password
            </Button>
          </div>

          {generatedPassword && (
            <div className="space-y-2 pt-2 border-t animate-in fade-in duration-200">
              <div className="flex items-center gap-2 w-full">
                <Label htmlFor="result-password" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Generated Password</Label> 
                <div className="ml-auto flex items-center gap-2">
                  {strength && (
                    <Badge variant={strength.variant} className="text-[10px] font-bold">
                      {strength.label}
                    </Badge>
                  )}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyPassword}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <Input
                id="result-password"
                type="text"
                value={generatedPassword}
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
