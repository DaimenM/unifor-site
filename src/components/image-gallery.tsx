import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Copy, ImageIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

interface ImageGalleryProps {
  images: string[];
  onImageSelect: (imageUrl: string) => void;
}

export function ImageGallery({ images, onImageSelect }: ImageGalleryProps) {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      toast({
        title: "URL Copied",
        description: "Image URL has been copied to clipboard",
      });
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy URL to clipboard",
      });
      console.error("Failed to copy URL to clipboard", error);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <ImageIcon className="h-5 w-5" />
        <h3 className="font-semibold">Image Gallery</h3>
      </div>
      <ScrollArea className="h-[300px] pr-4">
        <div className="grid grid-cols-2 gap-4">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className="relative group border rounded-lg overflow-hidden"
            >
              <div className="aspect-square relative">
                <Image
                  src={imageUrl}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onImageSelect(imageUrl)}
                >
                  Insert
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleCopyUrl(imageUrl)}
                >
                  {copiedUrl === imageUrl ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
} 