import { useCallback, useState } from "react";
import { AppCard } from "@/components/app/card/AppCard";
import { Label } from "@/components/ui/label";
import { ImageIcon, Upload, Download, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { invoke } from "@tauri-apps/api/core";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const IMAGE_FORMATS = [
  { value: "png", label: "PNG" },
  { value: "jpeg", label: "JPEG" },
  { value: "webp", label: "WebP" },
  { value: "tiff", label: "TIFF" },
  { value: "bmp", label: "BMP" },
  { value: "gif", label: "GIF" },
];

export function ImageConverterScreen() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState("png");
  const [isConverting, setIsConverting] = useState(false);
  const [convertedImage, setConvertedImage] = useState<{ data: string, format: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setConvertedImage(null);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setConvertedImage(null);
  };

  const convertImage = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });

      reader.readAsDataURL(selectedFile);
      const base64Data = await base64Promise;

      const result = await invoke<string>("convert_image", {
        imageData: base64Data,
        targetFormat,
      });

      setConvertedImage({ data: result, format: targetFormat });
      toast.success(`Image converted to ${targetFormat.toUpperCase()} successfully!`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to convert image: " + error);
    } finally {
      setIsConverting(false);
    }
  };

  const downloadImage = () => {
    if (!convertedImage) return;

    const link = document.createElement("a");
    link.href = `data:image/${convertedImage.format};base64,${convertedImage.data}`;
    link.download = `converted-image.${convertedImage.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <AppCard
        title="Image Converter"
        description="Convert images between different formats (WebP, PNG, JPEG, TIFF, etc.)."
        accent={<ImageIcon />}
      >
        <div className="space-y-6">
          {!selectedFile ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 transition-colors hover:bg-accent/10">
              <Upload className="size-10 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4 text-center">
                Drag and drop your image here, or click to browse
              </p>
              <input
                type="file"
                id="image-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Button asChild variant="outline">
                <label htmlFor="image-upload" className="cursor-pointer">
                  Select Image
                </label>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted/20">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 size-8 rounded-full shadow-lg"
                  onClick={handleClear}
                >
                  <X className="size-4" />
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2 w-full">
                  <Label htmlFor="target-format">Target Format</Label>
                  <Select value={targetFormat} onValueChange={setTargetFormat}>
                    <SelectTrigger id="target-format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {IMAGE_FORMATS.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="w-full sm:w-auto font-semibold h-10" 
                  onClick={convertImage}
                  disabled={isConverting}
                >
                  {isConverting ? (
                    <>
                      <RefreshCw className="mr-2 size-4 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    "Convert Image"
                  )}
                </Button>
              </div>
            </div>
          )}

          {convertedImage && (
            <div className="pt-6 border-t animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Conversion Successful
                </Label>
                <Button size="sm" onClick={downloadImage} className="gap-2">
                  <Download className="size-4" />
                  Download {convertedImage.format.toUpperCase()}
                </Button>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden border bg-muted/20 relative group">
                <img
                  src={`data:image/${convertedImage.format};base64,${convertedImage.data}`}
                  alt="Converted Result"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-sm font-medium">Ready for download</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </AppCard>
    </div>
  );
}
