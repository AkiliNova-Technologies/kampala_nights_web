import React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  error?: string;
  icon?: React.ReactNode;
}

interface Suggestion {
  place_id: number;
  description: string;
  main_text: string;
  secondary_text: string;
  lat?: string;
  lon?: string;
}

interface LocationInputProps extends Omit<InputProps, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect?: (place: {
    address: string;
    placeId: string;
    lat?: number;
    lng?: number;
  }) => void;
  country?: string;
  debounceMs?: number;
  limit?: number;
}

const LocationInput = React.forwardRef<HTMLInputElement, LocationInputProps>(
  (
    {
      value,
      onChange,
      onPlaceSelect,
      country = "ug",
      debounceMs = 400,
      limit = 5,
      className,
      ...props
    },
    ref
  ) => {
    const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(-1);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const fetchSuggestions = async (input: string) => {
      if (!input.trim() || input.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        // OpenStreetMap Nominatim API
        const params = new URLSearchParams({
          q: input,
          format: 'json',
          limit: limit.toString(),
          addressdetails: '1',
          'accept-language': 'en',
        });

        if (country) {
          params.append('countrycodes', country.toLowerCase());
        }

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?${params}`,
          {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'YourAppName/1.0 (your@email.com)' // Important: Include your app info
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const formattedSuggestions = data.map((place: any) => {
          // Extract main text (usually the name or first part of display name)
          const displayParts = place.display_name.split(',');
          const mainText = place.name || displayParts[0] || place.display_name;
          const secondaryText = displayParts.slice(1, 3).join(', ').trim();

          return {
            place_id: place.place_id,
            description: place.display_name,
            main_text: mainText,
            secondary_text: secondaryText,
            lat: place.lat,
            lon: place.lon,
          };
        });

        setSuggestions(formattedSuggestions);
      } catch (error) {
        console.error("Error fetching OSM suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange(newValue);
      setShowSuggestions(true);
      setActiveIndex(-1);

      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set new timeout - OSM has rate limits so we use longer debounce
      debounceTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(newValue);
      }, debounceMs);
    };

    const handleSuggestionClick = (suggestion: Suggestion) => {
      onChange(suggestion.description);
      setShowSuggestions(false);
      setSuggestions([]);
      setActiveIndex(-1);

      if (onPlaceSelect) {
        onPlaceSelect({
          address: suggestion.description,
          placeId: suggestion.place_id.toString(),
          lat: suggestion.lat ? parseFloat(suggestion.lat) : undefined,
          lng: suggestion.lon ? parseFloat(suggestion.lon) : undefined,
        });
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions || suggestions.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < suggestions.length) {
            handleSuggestionClick(suggestions[activeIndex]);
          }
          break;
        case "Escape":
          setShowSuggestions(false);
          setActiveIndex(-1);
          break;
      }
    };

    const handleBlur = (_: React.FocusEvent) => {
      // Use setTimeout to allow click event to fire first
      setTimeout(() => {
        setShowSuggestions(false);
      }, 200);
    };

    React.useEffect(() => {
      return () => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
      };
    }, []);

    return (
      <div className="relative w-full">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => setShowSuggestions(true)}
          className={className}
          autoComplete="off"
          {...props}
        />

        {showSuggestions && (suggestions.length > 0 || isLoading) && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
            {isLoading ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                Loading suggestions...
              </div>
            ) : (
              suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.place_id}
                  type="button"
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                    index === activeIndex && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="font-medium">{suggestion.main_text}</div>
                  {suggestion.secondary_text && (
                    <div className="text-xs text-muted-foreground">
                      {suggestion.secondary_text}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        )}

        {/* Add attribution to OpenStreetMap as required by their license */}
        {suggestions.length > 0 && (
          <div className="absolute -bottom-6 left-0 text-xs text-muted-foreground">
            © OpenStreetMap contributors
          </div>
        )}
      </div>
    );
  }
);

LocationInput.displayName = "LocationInput";

export { LocationInput };