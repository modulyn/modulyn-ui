"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "./badge";
import { Input } from "./input";
import { cn } from "@/lib/utils";

export interface Tag {
  id: string;
  name: string;
}

export type TagErrorCode = "E01" | "E02"; // E01: Tag exists, E02: Not in suggestions

interface TagsInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "onError"
  > {
  value: Tag[];
  onChange: (tags: Tag[]) => void;
  suggestions?: Tag[];
  className?: string;
  inputClassName?: string;
  badgeClassName?: string;
  badgeCloseClassName?: string;
  autocompleteClassName?: string;
  onlyFromSuggestions?: boolean;
  maxTags?: number;
  onError?: (code: TagErrorCode) => void;
  onInputChange?: (value: string) => void;
}

export const TagsInput = React.forwardRef<HTMLInputElement, TagsInputProps>(
  (
    {
      value,
      onChange,
      suggestions = [],
      className,
      inputClassName,
      badgeClassName,
      badgeCloseClassName,
      autocompleteClassName,
      onlyFromSuggestions = false,
      maxTags,
      onError,
      onInputChange,
      ...props
    },
    _ref
  ) => {
    const [inputValue, setInputValue] = React.useState("");
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(-1);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const isMaxTagsReached = maxTags ? value.length >= maxTags : false;

    const filteredSuggestions = React.useMemo(() => {
      return suggestions.filter(
        (suggestion) =>
          suggestion.name.toLowerCase().includes(inputValue.toLowerCase()) &&
          !value.some((tag) => tag.id === suggestion.id)
      );
    }, [suggestions, inputValue, value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isMaxTagsReached) return;
      const newValue = e.target.value;
      setInputValue(newValue);
      setShowSuggestions(newValue.length > 0);
      onInputChange?.(newValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !inputValue && value.length > 0) {
        onChange(value.slice(0, -1));
      } else if (e.key === "Enter" && inputValue.trim()) {
        e.preventDefault();

        if (maxTags && value.length >= maxTags) {
          setInputValue("");
          return;
        }

        if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
          addTag(filteredSuggestions[selectedIndex]);
        } else {
          const existingTag = suggestions.find(
            (s) => s.name.toLowerCase() === inputValue.toLowerCase()
          );
          if (existingTag) {
            addTag(existingTag);
          } else if (onlyFromSuggestions) {
            onError?.("E02");
            setInputValue("");
          } else {
            addTag({ id: `new-${Date.now()}`, name: inputValue.trim() });
          }
        }
        setSelectedIndex(-1);
      } else if (e.key === "ArrowDown" && showSuggestions) {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : -1
        );
      } else if (e.key === "ArrowUp" && showSuggestions) {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > -1 ? prev - 1 : filteredSuggestions.length - 1
        );
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    const addTag = (tag: Tag) => {
      if (maxTags && value.length >= maxTags) {
        setInputValue("");
        return;
      }

      if (!value.some((t) => t.name.toLowerCase() === tag.name.toLowerCase())) {
        onChange([...value, tag]);
        setInputValue("");
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.focus();
      } else {
        onError?.("E01");
        setInputValue("");
      }
    };

    const removeTag = (tagToRemove: Tag) => {
      onChange(value.filter((tag) => tag.id !== tagToRemove.id));
    };

    return (
      <div className={cn("relative", className)}>
        <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[2.5rem]">
          {value.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className={cn("flex items-center gap-1", badgeClassName)}
            >
              {tag.name}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className={cn(
                  "ml-1 hover:bg-muted rounded-full",
                  badgeCloseClassName
                )}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Input
            {...props}
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isMaxTagsReached}
            className={cn(
              "flex-1 !border-none !shadow-none !outline-none !ring-0 min-w-[120px] p-0",
              isMaxTagsReached && "cursor-not-allowed opacity-50",
              inputClassName
            )}
          />
        </div>
        {showSuggestions &&
          filteredSuggestions.length > 0 &&
          !isMaxTagsReached && (
            <div
              className={cn(
                "absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md",
                autocompleteClassName,
                "[&>ul]:py-1",
                "[&>ul>li]:px-3 [&>ul>li]:py-2 [&>ul>li]:cursor-pointer"
              )}
            >
              <ul>
                {filteredSuggestions.map((suggestion, index) => (
                  <li
                    key={suggestion.id}
                    className={cn(
                      "hover:bg-muted",
                      selectedIndex === index && "bg-accent hover:bg-accent"
                    )}
                    onClick={() => addTag(suggestion)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>
    );
  }
);

TagsInput.displayName = "TagsInput";
