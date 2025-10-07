import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ArrayInputProps {
  label?: string;
  values: string[];
  buttonLabel?: string;
  onChange: (values: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  className?: string;
}

export function ArrayInput({
  label,
  values,
  onChange,
  buttonLabel = "Add",
  placeholder = "Add an item",
  suggestions = [],
  className,
}: ArrayInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addValue = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !values.includes(trimmedValue)) {
      onChange([...values, trimmedValue]);
      setInputValue("");
    }
  };

  const removeValue = (valueToRemove: string) => {
    onChange(values.filter((value) => value !== valueToRemove));
  };

  const addSuggestion = (suggestion: string) => {
    if (!values.includes(suggestion)) {
      onChange([...values, suggestion]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addValue();
    } else if (e.key === "Escape") {
      setInputValue("");
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Label */}
      {label && <Label className="text-sm font-medium">{label}</Label>}

      {/* Current Values */}
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <Badge
            key={value}
            variant="outline"
            className="flex items-center gap-1 px-3 py-2 text-[13px] text-[#5014D0] bg-[#E7E0FB] dark:bg-[#3C2F6B] dark:text-white border-0"
          >
            {value}
            <Button
              variant="ghost"
              onClick={() => removeValue(value)}
              className="ml-1 hover:text-destructive transition-colors h-4 w-4"
            >
              <X className="h-3 w-3"/>
            </Button>
          </Badge>
        ))}
      </div>

      {/* Add Input */}
      <div className="space-y-3">
        <div className="flex gap-6">
          <Input
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 h-11"
          />
          <Button
            type="button"
            variant={"secondary"}
            onClick={addValue}
            disabled={!inputValue.trim()}
            className="bg-[#5014D0] text-white hover:bg-[#5014D0]/90 flex items-center h-11 "
          >
            <Plus className="h-4 w-4 mr-1" />
            {buttonLabel}
          </Button>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              Popular suggestions:
            </p>
            <div className="flex flex-wrap gap-1">
              {suggestions.map((suggestion) => (
                <Badge
                  key={suggestion}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80 transition-colors"
                  onClick={() => addSuggestion(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
