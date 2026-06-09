import { useCallback, useState } from "react";
import { AppCard } from "@/components/app/card/AppCard";
import { Label } from "@/components/ui/label";
import { Palette, Pipette, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ColorScreen() {
  const [hex, setHex] = useState("#3B82F6");
  const [rgb, setRgb] = useState("59, 130, 246");
  const [hsl, setHsl] = useState("217, 91%, 60%");

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("").toUpperCase();
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    s /= 100; l /= 100; h /= 360;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  };

  const updateFromHex = useCallback((value: string) => {
    setHex(value);
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      const { r, g, b } = hexToRgb(value);
      setRgb(`${r}, ${g}, ${b}`);
      const { h, s, l } = rgbToHsl(r, g, b);
      setHsl(`${h}, ${s}%, ${l}%`);
    }
  }, []);

  const updateFromRgb = useCallback((value: string) => {
    setRgb(value);
    const parts = value.split(/[, ]+/).map(p => parseInt(p.trim()));
    if (parts.length === 3 && parts.every(p => !isNaN(p) && p >= 0 && p <= 255)) {
      const [r, g, b] = parts;
      const newHex = rgbToHex(r, g, b);
      setHex(newHex);
      const { h, s, l } = rgbToHsl(r, g, b);
      setHsl(`${h}, ${s}%, ${l}%`);
    }
  }, []);

  const updateFromHsl = useCallback((value: string) => {
    setHsl(value);
    const parts = value.split(/[, ]+/).map(p => p.trim());
    if (parts.length === 3) {
      const h = parseInt(parts[0]);
      const s = parseInt(parts[1].replace("%", ""));
      const l = parseInt(parts[2].replace("%", ""));
      if (!isNaN(h) && !isNaN(s) && !isNaN(l) && h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
        const { r, g, b } = hslToRgb(h, s, l);
        const newHex = rgbToHex(r, g, b);
        setHex(newHex);
        setRgb(`${r}, ${g}, ${b}`);
      }
    }
  }, []);

  const handleCopy = (text: string, label: string) => {
    copyToClipboard(text, `${label} copied to clipboard!`);
  };

  return (
    <TooltipProvider>
      <AppCard
        title="Color Converter"
        description="Convert colors between HEX, RGB, and HSL formats"
        accent={<Palette />}
      >
        <div className="space-y-4">
          <div className="relative group flex flex-col items-center gap-4 py-4">
            <div 
              className="w-full h-24 rounded-lg shadow-inner border border-border transition-colors duration-300 relative overflow-hidden"
              style={{ backgroundColor: hex }}
            >
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="relative">
                  <Input
                    type="color"
                    value={hex}
                    onChange={(e) => updateFromHex(e.target.value)}
                    className="absolute inset-0 w-8 h-8 opacity-0 cursor-pointer z-10"
                  />
                  <Button size="icon" variant="secondary" className="w-8 h-8 rounded-full shadow-md pointer-events-none">
                    <Pipette className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="hex-input" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">HEX Code</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(hex, "HEX")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy</TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="hex-input"
                value={hex}
                onChange={(e) => updateFromHex(e.target.value)}
                className="font-mono h-11 text-base bg-card/50"
                maxLength={7}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="rgb-input" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">RGB Format</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(rgb, "RGB")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy</TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="rgb-input"
                value={rgb}
                onChange={(e) => updateFromRgb(e.target.value)}
                className="font-mono h-11 text-base bg-card/50"
                placeholder="e.g., 59, 130, 246"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="hsl-input" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">HSL Format</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(hsl, "HSL")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy</TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="hsl-input"
                value={hsl}
                onChange={(e) => updateFromHsl(e.target.value)}
                className="font-mono h-11 text-base bg-card/50"
                placeholder="e.g., 217, 91%, 60%"
              />
            </div>
          </div>
        </div>
      </AppCard>
    </TooltipProvider>
  );
}
