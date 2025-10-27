import { useState } from "react";
import { Pen, X, Check, type LucideIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface ProfileSelectProps {
  icon?: LucideIcon;
  label?: string;
  placeholder?: string;
  value?: string;
  options?: { value: string; label: string }[];
  isEditable?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onSave?: (value: string) => void;
  onCancel?: () => void;
}

export function ProfileSelect({
  icon: Icon,
  label,
  placeholder = "Select an option",
  value = "",
  options = [],
  isEditable = false,
  disabled = false,
  onChange,
  onSave,
  onCancel,
}: ProfileSelectProps) {
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

  const handleSelectChange = (newValue: string) => {
    setEditValue(newValue);
    // Auto-save when selecting an option if desired
    // Alternatively, you can remove this and only save when clicking the check button
    if (isEditing) {
      // If you want auto-save on select, uncomment the line below
      // handleSave();
    } else {
      onChange?.(newValue);
    }
  };

  const canEdit = isEditable && !disabled;

  // Get the display label for the current value
  const displayValue = options.find(opt => opt.value === value)?.label || value || placeholder;

  return (
    <div className="space-y-2">
      {/* Header with label and action buttons */}
      <div className="flex items-center justify-between min-h-8 w-full">
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
                  className="h-8 w-8 p-0"
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

      {/* Select Field */}
      <div className={cn(
        "transition-colors",
        isEditing && "ring-1 ring-[#5014D0] rounded-md"
      )}>
        <Select
          value={isEditing ? editValue : value}
          onValueChange={handleSelectChange}
          disabled={(!isEditing && !isEditable) || disabled}
        >
          <SelectTrigger className={cn(
            "min-h-11 border-0 w-full",
            (!isEditable || disabled) && "bg-card border-0"
          )}>
            <SelectValue placeholder={placeholder}>
              {isEditing ? (options.find(opt => opt.value === editValue)?.label || editValue || placeholder) : displayValue}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}