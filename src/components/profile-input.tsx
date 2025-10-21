import { useState } from "react";
import { Pen, X, Check, type LucideIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface ProfileInputProps {
  icon?: LucideIcon;
  label?: string;
  placeholder?: string;
  value?: string;
  isEditable?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onSave?: (value: string) => void;
  onCancel?: () => void;
}

export function ProfileInput({
  icon: Icon,
  label,
  placeholder,
  value = "",
  isEditable = false,
  disabled = false,
  onChange,
  onSave,
  onCancel,
}: ProfileInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleEdit = () => {
    if (!isEditable || disabled) return;
    setEditValue(value);
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    onChange?.(editValue);
    onSave?.(editValue);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value);
    onCancel?.();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const canEdit = isEditable && !disabled;

  return (
    <div className="space-y-2">
      {/* Header with label and action buttons */}
      <div className="flex items-center justify-between min-h-8">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          {label && (
            <Label className="text-sm font-medium text-muted-foreground">
              {label}
            </Label>
          )}
        </div>

        {/* Action Buttons */}
        {canEdit && (
          <div className="flex items-center gap-1">
            {!isEditing ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="h-8 w-8 p-0"
              >
                <Pen className="h-3 w-3" />
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  className="h-8 w-8 p-0 "
                >
                  <Check className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Input Field */}
      <Input
        placeholder={placeholder}
        value={isEditing ? editValue : value}
        onChange={isEditing ? handleInputChange : undefined}
        disabled={(!isEditing && !isEditable) || disabled}
        readOnly={!isEditing}
        className={cn(
          "transition-colors h-11 border-0",
          (!isEditable || disabled) && "bg-card border-0",
          isEditing && "ring-1 ring-[#5014D0]",
        )}
      />
    </div>
  );
}
