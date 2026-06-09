import { useState, useCallback } from "react";
import { AppCard } from "@/components/app/card/AppCard";
import { Label } from "@/components/ui/label";
import { KeyRound, ShieldAlert, ShieldCheck, Copy } from "lucide-react";
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
import { JWT_DEFAULT_PAYLOAD, JWT_DEFAULT_SECRET } from "./constants";

const base64UrlEncode = (str: string) => {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

const base64UrlDecode = (str: string) => {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return decodeURIComponent(escape(atob(base64)));
};

export function JwtScreen() {
  const [encodePayload, setEncodePayload] = useState(JWT_DEFAULT_PAYLOAD);
  const [encodeSecret, setEncodeSecret] = useState(JWT_DEFAULT_SECRET);
  const [generatedToken, setGeneratedToken] = useState("");

  const [inputToken, setInputToken] = useState("");
  const [decodedHeader, setDecodedHeader] = useState("");
  const [decodedPayload, setDecodedPayload] = useState("");
  const [tokenExpiration, setTokenExpiration] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState<boolean | null>(null);
  const [tokenParts, setTokenParts] = useState<{ header: string; payload: string; signature: string }>({
    header: "",
    payload: "",
    signature: "",
  });

  const textEncoder = new TextEncoder();

  const bufferToBase64Url = useCallback((buffer: ArrayBuffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }, []);

  const handleGenerateJwt = async () => {
    try {
      JSON.parse(encodePayload);
      
      const headerObj = { alg: "HS256", typ: "JWT" };
      const encodedHeader = base64UrlEncode(JSON.stringify(headerObj));
      const encodedPayload = base64UrlEncode(encodePayload);
      
      const dataToSign = `${encodedHeader}.${encodedPayload}`;
      
      const cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        textEncoder.encode(encodeSecret),
        { name: "HMAC", hash: { name: "SHA-256" } },
        false,
        ["sign"]
      );

      const signatureBuffer = await window.crypto.subtle.sign(
        "HMAC",
        cryptoKey,
        textEncoder.encode(dataToSign)
      );

      const validSignature = bufferToBase64Url(signatureBuffer);
      
      const token = `${dataToSign}.${validSignature}`;
      
      setGeneratedToken(token);
      toast.success("JWT generated successfully!");
    } catch (error) {
      toast.error("Invalid Payload JSON or encryption error.");
    }
  };

  const handleCopyToken = useCallback(() => {
    if (!generatedToken) return;
    copyToClipboard(generatedToken, "JWT copied to clipboard!");
  }, [generatedToken]);

  const handleDecodeJwt = (token: string) => {
    setInputToken(token);
    if (!token.trim()) {
      clearDecodeFields();
      return;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      setTokenParts({ header: token, payload: "", signature: "" });
      clearDecodeFields();
      return;
    }

    setTokenParts({
      header: parts[0],
      payload: parts[1],
      signature: parts[2],
    });

    try {
      const headerDecoded = base64UrlDecode(parts[0]);
      const payloadDecoded = base64UrlDecode(parts[1]);

      setDecodedHeader(JSON.stringify(JSON.parse(headerDecoded), null, 2));
      setDecodedPayload(JSON.stringify(JSON.parse(payloadDecoded), null, 2));

      const payloadObj = JSON.parse(payloadDecoded);
      if (payloadObj && typeof payloadObj.exp === "number") {
        const expTimestamp = payloadObj.exp * 1000;
        const expDate = new Date(expTimestamp);
        
        const formattedDate = expDate.toLocaleString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        setIsExpired(expTimestamp < Date.now());
        setTokenExpiration(`This token ${isExpired ? 'expired' : 'expires'} on ${formattedDate}`);
      } else {
        setTokenExpiration("No expiration claim (exp) found in this token.");
        setIsExpired(null);
      }
    } catch (e) {
      clearDecodeFields();
    }
  };

  const clearDecodeFields = useCallback(() => {
    setDecodedHeader("");
    setDecodedPayload("");
    setTokenExpiration(null);
    setIsExpired(null);
  }, []);

  return (
    <TooltipProvider>
      <AppCard
        title="JWT Debugger"
        description="Encode and decode JSON Web Tokens dynamically with expiration analysis"
        accent={<KeyRound />}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-border">
          
          <div className="space-y-6 lg:pr-4">
            <div className="flex items-center gap-2">
              <Badge variant="default">
                Encoder
              </Badge>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="encode-payload" className="text-sm font-medium uppercase font-bold tracking-wider">
                Payload (JSON)
              </Label>
              <Textarea
                id="encode-payload"
                value={encodePayload}
                onChange={(e) => setEncodePayload(e.target.value)}
                className="font-mono text-xs min-h-[160px] resize-y"
                placeholder='{ "sub": "123", "name": "Admin" }'
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="encode-secret" className="text-sm font-medium uppercase font-bold tracking-wider">
                Secret Key
              </Label>
              <Input
                id="encode-secret"
                type="text"
                value={encodeSecret}
                onChange={(e) => setEncodeSecret(e.target.value)}
                className="text-sm font-mono h-11"
                placeholder="secret-key"
              />
            </div>

            <Button className="w-full h-11" onClick={handleGenerateJwt}>
              Generate JWT
            </Button>

            {generatedToken && (
              <div className="space-y-2 pt-4 border-t animate-in fade-in duration-200">
                <div className="flex items-center justify-between w-full">
                  <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Generated Token</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyToken}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy</TooltipContent>
                  </Tooltip>
                </div>
                <div className="p-3 bg-muted/50 rounded-md text-xs font-mono break-all select-all border leading-relaxed">
                  <span className="text-red-500">{generatedToken.split(".")[0]}</span>
                  <span className="text-muted-foreground">.</span>
                  <span className="text-purple-500">{generatedToken.split(".")[1]}</span>
                  <span className="text-muted-foreground">.</span>
                  <span className="text-cyan-500">{generatedToken.split(".")[2]}</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6 pt-6 lg:pt-0 lg:pl-6">
            <div className="flex items-center gap-2">
              <Badge variant="default">
                Decoder
              </Badge>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="decode-input" className="text-sm font-medium uppercase font-bold tracking-wider">
                Paste your JWT Token
              </Label>
              <Textarea
                id="decode-input"
                value={inputToken}
                onChange={(e) => handleDecodeJwt(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR..."
                className="font-mono text-xs min-h-[80px] resize-none"
              />
            </div>

            {inputToken && (
              <div className="p-3 bg-muted/30 rounded-md text-[11px] font-mono break-all border space-y-1">
                <div className="text-muted-foreground text-[10px] uppercase font-bold mb-1 tracking-wider">Token Breakdown:</div>
                {tokenParts.header && <span className="text-red-500">{tokenParts.header}</span>}
                {tokenParts.payload && (
                  <>
                    <span className="text-muted-foreground">.</span>
                    <span className="text-purple-500">{tokenParts.payload}</span>
                  </>
                )}
                {tokenParts.signature && (
                  <>
                    <span className="text-muted-foreground">.</span>
                    <span className="text-cyan-500">{tokenParts.signature}</span>
                  </>
                )}
              </div>
            )}

            {tokenExpiration && (
              <div
                className={`flex items-start gap-2 p-3 rounded-md border text-xs transition-all ${
                  isExpired === true
                    ? "bg-destructive/10 text-destructive border-destructive/20"
                    : isExpired === false
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-muted text-muted-foreground border-transparent"
                }`}
              >
                {isExpired === true && <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />}
                {isExpired === false && <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />}
                <span>{tokenExpiration}</span>
              </div>
            )}

            {decodedHeader && (
              <>
              <div className="grid gap-4 grid-cols-1 pt-2 border-t animate-in fade-in duration-200">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-red-500 uppercase font-bold tracking-wider">Header (Algorithm & Type)</Label>
                  <pre className="p-3 bg-muted/50 rounded-md font-mono text-[11px] overflow-x-auto border">
                    {decodedHeader}
                  </pre>
                </div>
              </div>

              <div className="grid gap-4 grid-cols-1 pt-2 border-t animate-in fade-in duration-200">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-purple-500 uppercase font-bold tracking-wider">Payload (Data)</Label>
                  <pre className="p-3 bg-muted/50 rounded-md font-mono text-[11px] overflow-x-auto border">
                    {decodedPayload}
                  </pre>
                </div>
              </div>
              </>
            )}
          </div>

        </div>
      </AppCard>
    </TooltipProvider>
  );
}
