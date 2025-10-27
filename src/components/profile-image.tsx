import { useState, useRef } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BaseImageComponentProps {
  src?: string;
  alt?: string;
  onImageChange?: (file: File) => void;
  onImageRemove?: () => void;
  editable?: boolean;
  className?: string;
}

interface ProfileImageComponentProps extends BaseImageComponentProps {
  variant: "profile";
  size?: "sm" | "md" | "lg";
  fallback?: string;
}

interface CoverImageComponentProps extends BaseImageComponentProps {
  variant: "cover";
  aspectRatio?: "16/9" | "21/9" | "4/3" | "auto" | "custom";
}

type ImageComponentProps =
  | ProfileImageComponentProps
  | CoverImageComponentProps;

export function ImageComponent(props: ImageComponentProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && props.editable && props.onImageChange) {
      props.onImageChange(file);
    }
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (props.editable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onImageRemove?.();
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!props.editable) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!props.editable) return;
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!props.editable) return;
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/") && props.onImageChange) {
      props.onImageChange(file);
    }
  };

  // Profile Image Component
  if (props.variant === "profile") {
    const sizeClasses = {
      sm: "h-16 w-16",
      md: "h-24 w-24",
      lg: "h-32 w-32",
    };

    const iconSizes = {
      sm: "h-5 w-5",
      md: "h-6 w-6",
      lg: "h-8 w-8",
    };

    return (
      <div
        className={cn(
          "relative rounded-full",
          props.editable && "cursor-pointer",
          sizeClasses[props.size || "md"],
          props.className
        )}
        onMouseEnter={() => props.editable && setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <Avatar
          className={cn(
            "h-full w-full",
            isDragging && "border-primary"
          )}
        >
          <AvatarImage src={props.src} alt={props.alt || "Profile image"} />
          <AvatarFallback className="bg-muted text-muted-foreground text-[38px]">
            <Camera className="h-10 w-10 text-muted-foreground/50" />
          </AvatarFallback>
        </Avatar>

        {/* Hover Overlay */}
        {props.editable && (isHovering || isDragging) && (
          <div
            className={cn(
              "absolute inset-0 rounded-full bg-black/50 flex items-center justify-center transition-all duration-200",
              isDragging ? "bg-primary/30" : "bg-black/50"
            )}
          >
            <div className="flex flex-col items-center gap-1 text-white">
              {isDragging ? (
                <Upload
                  className={cn(
                    "animate-bounce",
                    iconSizes[props.size || "md"]
                  )}
                />
              ) : (
                <Camera className={iconSizes[props.size || "md"]} />
              )}
              <span className="text-xs font-medium">
                {isDragging ? "Drop image" : "Change photo"}
              </span>
            </div>
          </div>
        )}

        {/* Remove Button */}
        {props.editable && props.src && (isHovering || isDragging) && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-1 -right-1 h-6 w-6 rounded-full"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        )}

        {/* Hidden File Input */}
        {props.editable && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        )}
      </div>
    );
  }

  // Cover Image Component
  if (props.variant === "cover") {
    const aspectRatios = {
      "16/9": "aspect-[16/9]",
      "21/9": "aspect-[21/9]",
      "4/3": "aspect-[4/3]",
      auto: "h-[320px]",
      custom: "",
    };

    return (
      <div
        className={cn(
          "relative w-full rounded-none overflow-hidden bg-muted",
          aspectRatios[props.aspectRatio || "16/9"],
          props.aspectRatio === "auto" && "min-h-[300px] max-h-[300px]",
          props.editable && "cursor-pointer",
          props.className
        )}
        onMouseEnter={() => props.editable && setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {props.src ? (
          <img
            src={props.src}
            alt={props.alt || "Cover image"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <Camera className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}

        {/* Hover Overlay */}
        {props.editable && (isHovering || isDragging) && (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-all duration-200",
              isDragging
                ? "bg-primary/20 border-2 border-primary border-dashed"
                : "bg-black/50"
            )}
          >
            <div className="flex flex-col items-center gap-2 text-white">
              {isDragging ? (
                <Upload className="h-8 w-8 animate-bounce" />
              ) : (
                <Camera className="h-8 w-8" />
              )}
              <span className="font-medium">
                {isDragging
                  ? "Drop to upload cover image"
                  : "Change cover image"}
              </span>
              <span className="text-sm text-white/80">
                {props.src
                  ? "Click or drag to replace"
                  : "Click or drag to upload"}
              </span>
            </div>
          </div>
        )}

        {/* Remove Button */}
        {props.editable && props.src && (isHovering || isDragging) && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-4 right-4"
            onClick={handleRemove}
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        )}

        {/* Hidden File Input */}
        {props.editable && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        )}
      </div>
    );
  }

  return null;
}

// Convenience components for specific use cases
export function ProfileImageComponent(
  props: Omit<ProfileImageComponentProps, "variant">
) {
  return <ImageComponent {...props} variant="profile" />;
}

export function CoverImageComponent(
  props: Omit<CoverImageComponentProps, "variant">
) {
  return <ImageComponent {...props} variant="cover" />;
}
