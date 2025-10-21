import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  imageUploadService,
  type UploadResponse,
} from "@/services/imageUploadService";

interface ImageUploadFieldProps {
  label: string;
  description?: string;
  recommendedSize: string;
  formats: string;
  maxSize?: number;
  onImageUpload: (url: string | null) => void;
  onUploadError?: (error: string) => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
  existingImageUrl?: string | null;
}

export function ImageUploadField({
  label,
  description,
  recommendedSize,
  formats,
  maxSize = 10,
  onImageUpload,
  onUploadError,
  onUploadStart,
  onUploadEnd,
  existingImageUrl,
}: ImageUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [showExistingImage, setShowExistingImage] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (existingImageUrl && !uploadedUrl && !preview) {
      setShowExistingImage(true);
    }
  }, [existingImageUrl, uploadedUrl, preview]);

  const handleFileUpload = async (file: File) => {
    const validationError = imageUploadService.validateFile(file, maxSize);
    if (validationError) {
      onUploadError?.(validationError);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setShowExistingImage(false);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setIsUploading(true);
    onUploadStart?.();

    try {
      console.log("Starting upload for:", file.name);
      const response: UploadResponse =
        await imageUploadService.uploadSingleImage(file);
      console.log("Upload successful:", response);

      setUploadedUrl(response.url);
      onImageUpload(response.url);
    } catch (error: any) {
      console.error("Upload failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Upload failed. Please try again.";
      onUploadError?.(errorMessage);

      setPreview(null);
      setUploadedUrl(null);
      setShowExistingImage(true);
      onImageUpload(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setIsUploading(false);
      onUploadEnd?.();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && !isUploading) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !isUploading) {
      handleFileUpload(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setUploadedUrl(null);
    setShowExistingImage(true); // Show existing image when new upload is removed
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveExisting = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowExistingImage(false);
    onImageUpload(null);
  };

  const handleViewExisting = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (existingImageUrl) {
      window.open(existingImageUrl, "_blank");
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-md font-medium">{label}</Label>

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors hover:border-[#5014D0]",
          isUploading ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50",
          (preview || (showExistingImage && existingImageUrl)) &&
            "border-solid border-primary/30"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileInputChange}
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : preview ? (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="max-h-32 max-w-full rounded object-cover"
            />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={handleRemove}
              disabled={isUploading}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : showExistingImage && existingImageUrl ? (
          <div className="relative inline-block">
            <img
              src={existingImageUrl}
              alt="Existing"
              className="max-h-32 max-w-full rounded object-cover"
            />
            <div className="absolute -top-2 -right-2 flex gap-1">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={handleViewExisting}
                disabled={isUploading}
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={handleRemoveExisting}
                disabled={isUploading}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Existing image - upload new to replace
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Upload {label}</p>
              <p className="text-sm text-muted-foreground">OR</p>
              <p className="text-sm font-medium">
                Drag and Drop {label.toLowerCase()}
              </p>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {description} Recommended size: {recommendedSize}. {formats}, Max{" "}
        {maxSize}MB.
        {uploadedUrl && (
          <span className="block text-green-600 mt-1">
            Image uploaded successfully!
          </span>
        )}
        {showExistingImage && existingImageUrl && !uploadedUrl && (
          <span className="block text-blue-600 mt-1">Using existing image</span>
        )}
      </p>
    </div>
  );
}
