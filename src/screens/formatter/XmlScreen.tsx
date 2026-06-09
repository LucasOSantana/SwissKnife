import { useCallback, useState } from "react";
import { AppCard } from "@/components/app/card/AppCard";
import { Label } from "@/components/ui/label";
import { CodeXml, AlertTriangle, CheckCircle2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { XML_MODE_OPTIONS } from "./constants";

type XmlMode = "prettify" | "minify";

export function XmlScreen() {
  const [mode, setMode] = useState<XmlMode>("prettify");
  const [inputText, setInputText] = useState("");
  const [resultText, setResultText] = useState("");
  const [syntaxError, setSyntaxError] = useState<string | null>(null);
  const [isValidated, setIsValidated] = useState(false);

  const handleCopyResult = useCallback(() => {
    if (!resultText) return;
    copyToClipboard(resultText, "Result copied to clipboard!");
  }, [resultText]);

  const formatXml = useCallback((xmlString: string): string => {
    let formatted = "";
    let indent = "";
    const tab = "  ";

    const nodes = xmlString.replace(/>\s*</g, "><").trim().split(/(?=<)/);

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      
      if (node.match(/^<\/\w/)) {
        indent = indent.substring(tab.length);
      }

      formatted += indent + node + "\n";

      if (node.match(/^<\w[^>]*[^\/]>$/) && !node.match(/^<\/\w/)) {
        indent += tab;
      }
    }
    return formatted.trim();
  }, []);

  const handleProcessXml = useCallback(() => {
    setSyntaxError(null);
    setIsValidated(false);

    if (!inputText.trim()) {
      toast.error("Please enter some XML text first.");
      return;
    }

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(inputText, "application/xml");
      
      const parserError = xmlDoc.getElementsByTagName("parsererror");
      if (parserError.length > 0) {
        throw new Error(parserError[0].textContent || "Invalid XML structure.");
      }

      setIsValidated(true);

      const serializer = new XMLSerializer();
      const minified = serializer.serializeToString(xmlDoc).replace(/>\s*</g, "><").trim();

      if (mode === "prettify") {
        setResultText(formatXml(minified));
      } else {
        setResultText(minified);
      }

      toast.success(`XML successfully ${mode}d!`);
    } catch (error) {
      if (error instanceof Error) {
        const cleanError = error.message.replace("This page contains the following errors:", "").trim();
        setSyntaxError(cleanError);
      } else {
        setSyntaxError("Unknown XML syntax error occurred.");
      }
      setResultText("");
      toast.error("Invalid XML syntax. Check details below.");
    }
  }, [formatXml, inputText]);

  return (
    <TooltipProvider>
      <AppCard
        title="XML Minifier / Prettifier"
        description="Format, validate tag compliance, and compress XML data seamlessly"
        accent={<CodeXml />}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="xml-mode" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Action
            </Label>
            <Select
              value={mode}
              onValueChange={(value) => setMode(value as XmlMode)}
            >
              <SelectTrigger id="xml-mode" className="w-full bg-card h-11">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                {XML_MODE_OPTIONS.map((item) => (
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
            <Label htmlFor="input-xml" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
              Source XML
            </Label>
            <textarea
              id="input-xml"
              placeholder='<note>\n  <to>User</to>\n  <from>Admin</from>\n  <heading>Reminder</heading>\n  <body>Don&apos;t forget me!</body>\n</note>'
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex min-h-[160px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm font-mono shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
            />
          </div>

          <Button className="w-full mt-2 h-11" onClick={handleProcessXml}>
            Process XML
          </Button>

          {syntaxError && (
            <div className="flex gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-xs items-start border border-destructive/20 animate-in fade-in duration-200">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">XML Validation Error:</p>
                <p className="font-mono text-[11px] opacity-90 break-all">{syntaxError}</p>
              </div>
            </div>
          )}

          {isValidated && !syntaxError && (
            <div className="flex gap-2 p-3 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs items-center border border-emerald-500/20 animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span className="font-medium">XML structure is valid and well-formed!</span>
            </div>
          )}

          {resultText && (
            <div className="space-y-2 pt-2 border-t animate-in fade-in duration-200">
              <div className="flex items-center gap-2 w-full">
                <Label htmlFor="result-xml" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  Processed Output
                </Label>
                <div className="ml-auto flex items-center gap-2">
                  <Badge variant="default" className="ml-1 text-[10px] font-bold uppercase">
                    {mode === "prettify" ? "Formatted" : "Minified"}
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
              <textarea
                id="result-xml"
                value={resultText}
                readOnly
                className="flex min-h-[160px] w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm font-mono shadow-sm text-left focus-visible:outline-none focus-visible:ring-0 select-all cursor-default resize-y"
              />
            </div>
          )}
        </div>
      </AppCard>
    </TooltipProvider>
  );
}
